"use client";

const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "905423584852";

export default function WhatsAppFloating() {
  const message = "Merhaba, toner ve kartuş ürünleri hakkında bilgi almak istiyorum.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-2xl shadow-emerald-950/20 transition hover:bg-emerald-700 sm:bottom-6 sm:right-6"
    >
      <span className="flex h-3 w-3 rounded-full bg-white" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
