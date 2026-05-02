import Product from "@/models/Product";
import { slugify } from "@/lib/slugify";

export type ProductInput = {
  name?: unknown;
  price?: unknown;
  image?: unknown;
  description?: unknown;
  category?: unknown;
  brand?: unknown;
  printerModels?: unknown;
  stock?: unknown;
};

const fallbackImage = "/images/yazıcıhp.png";

type ProductDocument = {
  _id: unknown;
  name?: string;
  slug?: string;
  save: () => Promise<unknown>;
} & Record<string, unknown>;

function readString(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeStock(value: unknown) {
  const nextStock = Number(readString(value).replace(",", ".") || 0);
  return Number.isFinite(nextStock) ? nextStock : 0;
}

async function createUniqueSlug(name: string, currentProductId?: string) {
  const baseSlug = slugify(name) || "urun";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingProduct = await Product.findOne({ slug }).select("_id").lean();

    if (
      !existingProduct ||
      (currentProductId && String(existingProduct._id) === currentProductId)
    ) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export function normalizeProductInput(input: ProductInput) {
  const name = readString(input.name);
  const price = readString(input.price);

  if (!name || !price) {
    throw new Error("Ürün adı ve fiyat zorunludur.");
  }

  return {
    name,
    price,
    image: readString(input.image) || fallbackImage,
    description: readString(input.description),
    category: readString(input.category) || "Genel",
    brand: readString(input.brand),
    printerModels: readString(input.printerModels),
    stock: normalizeStock(input.stock),
  };
}

export async function createProduct(input: ProductInput) {
  const productInput = normalizeProductInput(input);
  const slug = await createUniqueSlug(productInput.name);

  return Product.create({
    ...productInput,
    slug,
  });
}

export async function updateProduct(product: ProductDocument, input: ProductInput) {
  const productInput = normalizeProductInput(input);
  const productId = String(product._id);
  const slug =
    product.name === productInput.name
      ? product.slug
      : await createUniqueSlug(productInput.name, productId);

  Object.assign(product, {
    ...productInput,
    slug,
  });

  await product.save();
  return product;
}
