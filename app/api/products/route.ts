import { getProducts } from "@/lib/products";
import { connectDB } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { createProduct } from "@/lib/productMutations";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { message: "Ürünler alınamadı" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
  }

  try {
    await connectDB();

    const body = await req.json();
    const product = await createProduct(body);

    return NextResponse.json(
      {
        message: "Ürün başarıyla eklendi",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Ürün eklenemedi",
      },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}
