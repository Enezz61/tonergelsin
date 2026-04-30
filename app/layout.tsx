import WhatsAppFloating from "@/components/WhatsAppFloating";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TonerGelsin | Toner & Kartuş",
  description:
    "Orijinal ve muadil toner ve kartuş satışı. Hızlı sipariş, uygun fiyat ve kurumsal destek.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-slate-800">
        <div className="bg-slate-950 px-4 py-2 text-center text-sm text-white">
          TonerGelsin - Aynı gün kargo, kurumsal çözümler ve güvenilir satış desteği
        </div>

        <main className="flex-1">{children}</main>
        <WhatsAppFloating />
      </body>
    </html>
  );
}
