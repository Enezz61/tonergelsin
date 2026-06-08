import Link from "next/link";

type HeroProps = {
  productCount?: number;
  categories?: string[];
  latestProductName?: string;
};

export default function Hero({
  productCount = 0,
  categories = [],
  latestProductName,
}: HeroProps) {
  const heroNotes = [
    `${productCount} ürün katalogda`,
    categories.length > 0
      ? `${categories.slice(0, 2).join(", ")} kategorileri`
      : "Kategori bilgisi admin panelinden gelir",
    latestProductName ? `Son eklenen: ${latestProductName}` : "Ürünler veri tabanından yüklenir",
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.35),transparent_34%),linear-gradient(120deg,rgba(15,23,42,0.15),rgba(15,23,42,0.9))]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100">
            Yazıcı sarf malzemelerinde hızlı tedarik
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Toner ve kartuşta hızlı, net ve güvenilir çözüm.
          </h1>



          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded-lg bg-orange-500 px-6 py-3 text-center font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-600"
            >
              Ürünleri Gör
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/20 px-6 py-3 text-center font-bold text-white transition hover:bg-white/10"
            >
              Teklif Al
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="grid gap-3">
            {heroNotes.map((item) => (
              <div key={item} className="rounded-lg bg-white p-4 text-slate-900">
                <p className="font-bold">{item}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Güncel katalog bilgisi.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
