import { connectDB } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { updateProduct } from "@/lib/productMutations";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
  }

  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }

    const updatedProduct = await updateProduct(product, body);

    return NextResponse.json({
      message: "Ürün güncellendi",
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Ürün güncellenemedi",
      },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorized(req)) {
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
