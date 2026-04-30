import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import OrderButton from "@/components/OrderButton";
import { getProductBySlug } from "@/lib/products";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const stockText =
    typeof product.stock === "number" && product.stock > 0
      ? `${product.stock} adet stok`
      : "Stok bilgisi için iletişime geçin";

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <nav className="mb-6 text-sm font-medium text-slate-500">
          <Link href="/" className="hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-orange-600">
            Ürünler
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{product.name}</span>
        </nav>

        <div className="grid gap-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2 lg:p-8">
          <div className="flex min-h-[360px] items-center justify-center rounded-lg bg-slate-100 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image || "/images/yazıcıhp.png"}
              alt={product.name}
              className="max-h-[480px] w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                {product.category || "Genel"}
              </span>
              {product.brand && (
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                  {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-4xl font-black text-orange-600">
                {product.price} TL
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                {stockText}
              </span>
            </div>

            <p className="mt-6 leading-8 text-slate-600">
              {product.description ||
                "Bu ürün için detaylı açıklama henüz eklenmemiştir. Sipariş ve bilgi almak için bizimle iletişime geçebilirsiniz."}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-black text-slate-950">Kategori</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {product.category || "Genel"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-black text-slate-950">Marka</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {product.brand || "Belirtilmedi"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-black text-slate-950">Stok</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {stockText}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-black text-slate-950">Uyumlu Modeller</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {product.printerModels || "Bilgi için iletişime geçin"}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <OrderButton product={product} />
              <Link
                href="/products"
                className="rounded-lg border border-slate-300 px-6 py-4 text-center font-bold text-slate-900 transition hover:border-orange-400 hover:text-orange-600"
              >
                Tüm Ürünler
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
