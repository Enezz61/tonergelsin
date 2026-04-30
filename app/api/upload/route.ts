import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function isAuthorized(req: Request) {
  const expectedToken = process.env.ADMIN_TOKEN ?? "admin-token-123";
  return req.headers.get("authorization") === `Bearer ${expectedToken}`;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Görsel dosyası bulunamadı" },
        { status: 400 }
      );
    }

    const extension = allowedTypes.get(file.type);

    if (!extension) {
      return NextResponse.json(
        { message: "Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Görsel 5 MB'den küçük olmalıdır" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const filePath = path.join(uploadsDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, bytes);

    return NextResponse.json({
      url: `/uploads/${fileName}`,
    });
  } catch {
    return NextResponse.json({ message: "Görsel yüklenemedi" }, { status: 500 });
  }
}
