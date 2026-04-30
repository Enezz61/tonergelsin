import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export type ProductRecord = {
  _id: string;
  name: string;
  slug: string;
  price: string | number;
  image?: string;
  description?: string;
  category?: string;
  brand?: string;
  printerModels?: string;
  stock?: number;
};

export type ProductFilters = {
  q?: string;
  category?: string;
  brand?: string;
  stock?: string;
  sort?: string;
};

function serializeProduct(product: unknown): ProductRecord {
  return JSON.parse(JSON.stringify(product)) as ProductRecord;
}

function toPriceNumber(price: string | number) {
  if (typeof price === "number") return price;
  const normalized = price.replace(",", ".").replace(/[^\d.]/g, "");
  return Number(normalized || 0);
}

function sortProducts(products: ProductRecord[], sort?: string) {
  const nextProducts = [...products];

  if (sort === "price-asc") {
    return nextProducts.sort((a, b) => toPriceNumber(a.price) - toPriceNumber(b.price));
  }

  if (sort === "price-desc") {
    return nextProducts.sort((a, b) => toPriceNumber(b.price) - toPriceNumber(a.price));
  }

  if (sort === "name-asc") {
    return nextProducts.sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }

  return nextProducts;
}

export async function getProducts(filters: ProductFilters = {}) {
  await connectDB();

  const query: Record<string, unknown> = {};
  const q = filters.q?.trim();

  if (q) {
    const regex = new RegExp(q, "i");
    query.$or = [
      { name: regex },
      { description: regex },
      { category: regex },
      { brand: regex },
      { printerModels: regex },
    ];
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.brand) {
    query.brand = filters.brand;
  }

  if (filters.stock === "in-stock") {
    query.stock = { $gt: 0 };
  }

  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return sortProducts(products.map((product) => serializeProduct(product)), filters.sort);
}

export async function getProductOptions() {
  await connectDB();

  const [categories, brands] = await Promise.all([
    Product.distinct("category"),
    Product.distinct("brand"),
  ]);

  return {
    categories: categories.filter(Boolean).sort((a, b) => a.localeCompare(b, "tr")),
    brands: brands.filter(Boolean).sort((a, b) => a.localeCompare(b, "tr")),
  };
}

export async function getProductBySlug(slug: string) {
  await connectDB();

  const product = await Product.findOne({ slug }).lean();
  return product ? serializeProduct(product) : null;
}
