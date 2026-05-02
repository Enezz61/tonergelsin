import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="text-slate-950" />
        <p>© 2026 - Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
