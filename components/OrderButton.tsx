"use client";

type OrderProduct = {
  name: string;
  price: string | number;
};

const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "905XXXXXXXXX";

export default function OrderButton({ product }: { product: OrderProduct }) {
  const sendWhatsApp = () => {
    const message = `Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum. Fiyat: ${product.price}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <button
      onClick={sendWhatsApp}
      className="w-full rounded-lg bg-emerald-600 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-emerald-700"
    >
      WhatsApp Sipariş
    </button>
  );
}
