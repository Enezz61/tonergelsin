import { getProductBySlug } from "@/lib/products";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        { message: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product,
      id: product._id,
    });
  } catch {
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
