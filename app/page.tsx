import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { getProductOptions, getProducts } from "@/lib/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, options] = await Promise.all([getProducts(), getProductOptions()]);
  const featuredProducts = products.slice(0, 6);
  const latestProduct = products[0];
  const inStockCount = products.filter(
    (product) => typeof product.stock === "number" && product.stock > 0
  ).length;

  const stats = [
    {
      title: "Katalogdaki Ürün",
      value: products.length.toString(),
      text: "",
    },
    {
      title: "Kategori",
      value: options.categories.length.toString(),
      text:
        options.categories.length > 0
          ? options.categories.slice(0, 3).join(", ")
          : "Henüz kategori yok.",
    },
    {
      title: "Stoktaki Ürün",
      value: inStockCount.toString(),
      text: latestProduct ? `Son eklenen: ${latestProduct.name}` : "Admin panelinden ürün ekleyin.",
    },
  ];

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <Navbar />
      <Hero
        productCount={products.length}
        categories={options.categories}
        latestProductName={latestProduct?.name}
      />

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
              {stat.title}
            </p>
            <h2 className="mt-3 break-words text-3xl font-black text-slate-950">
              {stat.value}
            </h2>
            <p className="mt-2 leading-7 text-slate-600">{stat.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
              Ürünler
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Son eklenen toner ve kartuşlar
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
             
            </p>
          </div>

          <Link
            href="/products"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-900 transition hover:border-orange-300 hover:text-orange-600"
          >
            Tüm Ürünleri Gör
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-black text-slate-950">Henüz ürün eklenmemiş</h3>
            <p className="mt-2 text-slate-600">
           
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
              Hızlı seçim
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Markaya ve kategoriye göre ürün bulun.
            </h2>
            <p className="mt-3 leading-8 text-slate-600">
              Marka, kategori ve uyumlu yazıcı modeli bilgileri ürün aramasında kullanılır.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {options.categories.slice(0, 6).map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="rounded-lg border border-slate-200 p-4 font-bold text-slate-900 hover:border-orange-300 hover:text-orange-600"
              >
                {category}
              </Link>
            ))}
            {options.categories.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-300 p-5 text-slate-600">
                Kategoriler ürün ekledikçe otomatik görünür.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
