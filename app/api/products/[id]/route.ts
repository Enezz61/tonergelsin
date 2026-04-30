import { connectDB } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  const expectedToken = process.env.ADMIN_TOKEN ?? "admin-token-123";
  return req.headers.get("authorization") === `Bearer ${expectedToken}`;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
  }

  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const name = body.name?.trim();

    if (!name || !body.price) {
      return NextResponse.json(
        { message: "Ürün adı ve fiyat zorunludur." },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }

    const nextSlug = product.name === name ? product.slug : slugify(name);

    product.name = name;
    product.price = body.price;
    product.image = body.image || "/images/yazıcıhp.png";
    product.description = body.description || "";
    product.category = body.category || "Genel";
    product.brand = body.brand || "";
    product.printerModels = body.printerModels || "";
    product.stock = Number(body.stock || 0);
    product.slug = nextSlug;

    await product.save();

    return NextResponse.json({
      message: "Ürün güncellendi",
      product,
    });
  } catch {
    return NextResponse.json(
      { message: "Ürün güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
  }

  try {
    await connectDB();

    const { id } = await params;
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Ürün silindi" });
  } catch {
    return NextResponse.json({ message: "Ürün silinemedi" }, { status: 500 });
  }
}
