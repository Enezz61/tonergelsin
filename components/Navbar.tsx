import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
        <Link href="/" className="text-slate-950" aria-label="TonerGelsin ana sayfa">
          <Logo wordmarkClassName="hidden sm:block" />
        </Link>

        <nav className="flex items-center gap-1 text-sm font-semibold text-slate-600 sm:gap-3">
          <Link className="rounded-full px-3 py-2 hover:bg-orange-50 hover:text-orange-600" href="/">
            Ana Sayfa
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-orange-50 hover:text-orange-600" href="/products">
            Ürünler
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-orange-50 hover:text-orange-600" href="/contact">
            İletişim
          </Link>
        </nav>
      </div>
    </header>
  );
}
