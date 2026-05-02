import { randomUUID, createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export function validateImageFile(file: File) {
  const extension = allowedTypes.get(file.type);

  if (!extension) {
    return {
      ok: false as const,
      message: "Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      ok: false as const,
      message: "Görsel 5 MB'den küçük olmalıdır",
    };
  }

  return { ok: true as const, extension };
}

async function uploadLocal(file: File, extension: string) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, bytes);

  return `/uploads/${fileName}`;
}

function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER ?? "tonergelsin/products",
  };
}

function getCloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

async function uploadCloudinary(file: File) {
  const config = getCloudinaryConfig();
  const missing = [
    ["CLOUDINARY_CLOUD_NAME", config.cloudName],
    ["CLOUDINARY_API_KEY", config.apiKey],
    ["CLOUDINARY_API_SECRET", config.apiSecret],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Cloudinary ayarları eksik: ${missing.join(", ")}`);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedParams = {
    folder: config.folder,
    timestamp,
  };

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", config.apiKey as string);
  body.append("folder", config.folder);
  body.append("timestamp", timestamp);
  body.append(
    "signature",
    getCloudinarySignature(signedParams, config.apiSecret as string)
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: "POST",
      body,
    }
  );
  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary yüklemesi başarısız");
  }

  return data.secure_url;
}

export async function uploadProductImage(file: File) {
  const validation = validateImageFile(file);

  if (!validation.ok) {
    return validation;
  }

  const provider = process.env.UPLOAD_PROVIDER?.toLowerCase();
  const shouldUseCloudinary =
    provider === "cloudinary" ||
    (!provider && Boolean(process.env.CLOUDINARY_CLOUD_NAME));

  const url = shouldUseCloudinary
    ? await uploadCloudinary(file)
    : await uploadLocal(file, validation.extension);

  return { ok: true as const, url };
}
