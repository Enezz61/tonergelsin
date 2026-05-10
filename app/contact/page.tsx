"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "905423584852";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const send = () => {
    const message = `Ad: ${form.name}\nTelefon: ${form.phone}\nMesaj: ${form.message}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <Navbar />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
            İletişim
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">
            Doğru ürünü birlikte bulalım.
          </h1>
          <p className="mt-4 leading-8 text-slate-600">
            Model, stok veya toplu sipariş için mesaj bırakın. Talebiniz WhatsApp üzerinden hazır metin olarak açılır.
          </p>

          <div className="mt-8 grid gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="font-black text-slate-950">Hızlı teklif</p>
              <p className="mt-1 text-sm text-slate-500">Ürün adı veya yazıcı modelini yazmanız yeterli.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="font-black text-slate-950">Kurumsal sipariş</p>
              <p className="mt-1 text-sm text-slate-500">Toplu alımlar için fiyat ve tedarik desteği.</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4">
            <input
              placeholder="Ad Soyad"
              className={inputClass}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <input
              placeholder="Telefon"
              className={inputClass}
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
            <textarea
              placeholder="Mesaj"
              className={`${inputClass} min-h-36 resize-none`}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
            />
            <button
              onClick={send}
              className="rounded-lg bg-orange-500 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              WhatsApp ile Gönder
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
