"use client";

import Logo from "@/components/Logo";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState(process.env.NEXT_PUBLIC_ADMIN_USER || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json()) as { token?: string; message?: string };

      if (!res.ok || !data.token) {
        alert(data.message || "Hatalı giriş");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      router.push("/admin");
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1fr_460px]">
      <section className="hidden items-center px-12 lg:flex">
        <div className="max-w-2xl">
          <Logo className="text-white" />
          <h1 className="mt-4 text-5xl font-black leading-tight">
            Ürün kataloğunu hızlıca yönetin.
          </h1>
          <p className="mt-5 leading-8 text-slate-300">
            Canlı siteye çıkmadan önce ürün adı, fiyat, kategori ve açıklamaları tek panelden düzenleyin.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-stone-50 px-6 py-12 text-slate-900">
        <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-7 shadow-xl shadow-slate-950/10">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-600">
            Admin Panel
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Giriş Yap</h2>

          <div className="mt-7 grid gap-4">
            <input
              placeholder="Kullanıcı adı"
              className={inputClass}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <input
              type="password"
              placeholder="Şifre"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              onClick={login}
              disabled={loading}
              className="rounded-lg bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
