import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-center">
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-6xl font-black text-orange-500">404</p>
        <h1 className="mt-4 text-2xl font-black text-slate-950">
          Sayfa bulunamadı
        </h1>
        <p className="mt-2 leading-7 text-slate-600">
          Aradığınız sayfa kaldırılmış ya da adresi değişmiş olabilir.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
        >
          Ana Sayfa
        </Link>
      </div>
    </main>
  );
}
