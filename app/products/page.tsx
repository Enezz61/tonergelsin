import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { getProductOptions, getProducts, ProductFilters } from "@/lib/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value || "";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const filters: ProductFilters = {
    q: getParam(params, "q"),
    category: getParam(params, "category"),
    brand: getParam(params, "brand"),
    stock: getParam(params, "stock"),
    sort: getParam(params, "sort"),
  };

  const [products, options] = await Promise.all([
    getProducts(filters),
    getProductOptions(),
  ]);
  const hasFilter = Object.values(filters).some(Boolean);

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
            Ürün kataloğu
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Tüm Ürünler</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Toner, kartuş ve yazıcı sarf ürünlerini arayın; kategori, marka ve stok durumuna göre filtreleyin.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <form className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Ürün, marka, yazıcı modeli ara"
              className="rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />

            <select
              name="category"
              defaultValue={filters.category}
              className="rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Tüm kategoriler</option>
              {options.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              name="brand"
              defaultValue={filters.brand}
              className="rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Tüm markalar</option>
              {options.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              name="stock"
              defaultValue={filters.stock}
              className="rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Stok durumu</option>
              <option value="in-stock">Stokta olanlar</option>
            </select>

            <select
              name="sort"
              defaultValue={filters.sort}
              className="rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Yeni eklenenler</option>
              <option value="price-asc">Fiyat artan</option>
              <option value="price-desc">Fiyat azalan</option>
              <option value="name-asc">Ada göre</option>
            </select>

            <button className="rounded-lg bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600">
              Ara
            </button>
          </div>

          {hasFilter && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-600">
                {products.length} ürün bulundu.
              </p>
              <Link
                href="/products"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600"
              >
                Filtreleri temizle
              </Link>
            </div>
          )}
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-black text-slate-950">Sonuç bulunamadı</h2>
            <p className="mt-2 text-slate-600">
              Arama terimini değiştirin veya filtreleri temizleyin.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
