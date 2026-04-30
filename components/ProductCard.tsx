import Link from "next/link";

export type ProductCardData = {
  _id?: string;
  slug?: string;
  id?: number;
  name: string;
  price: string | number;
  image?: string;
  category?: string;
  brand?: string;
  stock?: number;
};

type ProductProps = {
  product: ProductCardData;
};

export default function ProductCard({ product }: ProductProps) {
  const url = product.slug
    ? `/products/${product.slug}`
    : `/products/${product._id || product.id}`;
  const stockLabel =
    typeof product.stock === "number" && product.stock > 0
      ? `${product.stock} stok`
      : "Bilgi al";

  return (
    <Link
      href={url}
      className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/70"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image || "/images/yazıcıhp.png"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {product.category && (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
              {product.category}
            </span>
          )}
          {product.brand && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
              {product.brand}
            </span>
          )}
        </div>

        <h3 className="min-h-14 text-lg font-bold leading-7 text-slate-950 transition group-hover:text-orange-600">
          {product.name}
        </h3>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-black text-slate-950">{product.price} TL</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{stockLabel}</p>
          </div>
          <span className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white transition group-hover:bg-orange-600">
            İncele
          </span>
        </div>
      </div>
    </Link>
  );
}
