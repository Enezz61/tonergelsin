import { isAdminAuthorized } from "@/lib/adminAuth";
import { uploadProductImage } from "@/lib/uploadStorage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdminAuthorized(req)) {
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

    const upload = await uploadProductImage(file);

    if (!upload.ok) {
      return NextResponse.json({ message: upload.message }, { status: 400 });
    }

    return NextResponse.json({
      url: upload.url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Görsel yüklenemedi",
      },
      { status: 500 }
    );
  }
}
