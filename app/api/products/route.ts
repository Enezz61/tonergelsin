import { getProducts } from "@/lib/products";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { slugify } from "@/lib/slugify";
import { NextResponse } from "next/server";

function isAuthorized(req: Request) {
  const expectedToken = process.env.ADMIN_TOKEN ?? "admin-token-123";
  return req.headers.get("authorization") === `Bearer ${expectedToken}`;
}

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
  if (!isAuthorized(req)) {
    return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 401 });
  }

  try {
    await connectDB();

    const body = await req.json();
    const name = body.name?.trim();
    const price = body.price;

    if (!name || !price) {
      return NextResponse.json(
        { message: "Ürün adı ve fiyat zorunludur." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await Product.create({
      name,
      price,
      image: body.image || "/images/yazıcıhp.png",
      description: body.description || "",
      category: body.category || "Genel",
      brand: body.brand || "",
      printerModels: body.printerModels || "",
      stock: Number(body.stock || 0),
      slug,
    });

    return NextResponse.json(
      {
        message: "Ürün başarıyla eklendi",
        product,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Ürün eklenemedi" },
      { status: 500 }
    );
  }
}
