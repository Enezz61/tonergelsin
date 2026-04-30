import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
            Sepet
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Sepetiniz şu anda boş
          </h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
            Ürünleri inceleyip sipariş talebinizi WhatsApp üzerinden hızlıca oluşturabilirsiniz.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Ürünlere Git
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
