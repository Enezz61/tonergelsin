"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AdminProduct = {
  _id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
  brand: string;
  printerModels: string;
  stock?: number;
  slug?: string;
};

type ProductsResponse = {
  products?: AdminProduct[];
  message?: string;
};

type UploadResponse = {
  url?: string;
  message?: string;
};

type ImportResponse = {
  message?: string;
  createdCount?: number;
  errorCount?: number;
  errors?: string[];
};

const emptyForm = {
  name: "",
  price: "",
  image: "",
  description: "",
  category: "",
  brand: "",
  printerModels: "",
  stock: "",
};

export default function AdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [uploading, setUploading] = useState<"new" | "edit" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const router = useRouter();

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("admin_token");
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = (await res.json()) as ProductsResponse;
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let active = true;

    fetch("/api/products")
      .then((res) => res.json())
      .then((data: ProductsResponse) => {
        if (!active) return;
        setProducts(data.products || []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, token]);

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

  const fileInputClass =
    "w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-bold file:text-white hover:border-orange-300";

  const uploadImage = async (file: File, target: "new" | "edit") => {
    const body = new FormData();
    body.append("image", file);

    setUploading(target);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body,
      });
      const data = (await res.json()) as UploadResponse;

      if (!res.ok || !data.url) {
        alert(data.message || "Görsel yüklenemedi");
        return;
      }

      if (target === "new") {
        setForm((current) => ({ ...current, image: data.url || "" }));
      } else {
        setEditProduct((current) =>
          current ? { ...current, image: data.url || "" } : current
        );
      }
    } finally {
      setUploading(null);
    }
  };

  const importProducts = async (file?: File) => {
    if (!file) return;

    const body = new FormData();
    body.append("file", file);
    setImporting(true);
    setImportResult(null);

    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body,
      });
      const data = (await res.json()) as ImportResponse;
      setImportResult(data);

      if (res.ok && (data.createdCount || 0) > 0) {
        fetchProducts();
      }
    } finally {
      setImporting(false);
    }
  };

  const addProduct = async () => {
    if (!form.name || !form.price) return;

    setSaving(true);
    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    setSaving(false);
    fetchProducts();
  };

  const deleteProduct = async (product: AdminProduct) => {
    const confirmed = window.confirm(
      `"${product.name}" ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
    );

    if (!confirmed) return;

    await fetch(`/api/products/${product._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    });

    fetchProducts();
  };

  const updateProduct = async () => {
    if (!editProduct) return;

    setSaving(true);
    await fetch(`/api/products/${editProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(editProduct),
    });

    setSaving(false);
    setEditProduct(null);
    fetchProducts();
  };

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <section className="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-orange-300">
              Yönetim paneli
            </p>
            <h1 className="mt-2 text-4xl font-black">Ürün Yönetimi</h1>
            <p className="mt-3 text-slate-300">
              Katalog ürünlerini ekleyin, düzenleyin ve yayından kaldırın.
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-5 py-3">
            <p className="text-sm text-slate-300">Toplam ürün</p>
            <p className="text-2xl font-black">{products.length}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[420px_1fr]">
        <aside className="grid gap-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Yeni Ürün Ekle</h2>

            <div className="mt-5 grid gap-3">
              <input
                placeholder="Ürün adı"
                value={form.name}
                className={inputClass}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              <input
                placeholder="Fiyat"
                value={form.price}
                className={inputClass}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
              />
              <input
                placeholder="Kategori"
                value={form.category}
                className={inputClass}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
              <input
                placeholder="Marka (HP, Canon, Brother...)"
                value={form.brand}
                className={inputClass}
                onChange={(event) => setForm({ ...form, brand: event.target.value })}
              />
              <input
                placeholder="Stok"
                value={form.stock}
                className={inputClass}
                onChange={(event) => setForm({ ...form, stock: event.target.value })}
              />

              <div className="grid gap-2">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className={fileInputClass}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadImage(file, "new");
                  }}
                />
                <input
                  placeholder="Yüklenen görsel yolu"
                  value={form.image}
                  className={inputClass}
                  onChange={(event) => setForm({ ...form, image: event.target.value })}
                />
                {uploading === "new" && (
                  <p className="text-sm font-semibold text-orange-600">Görsel yükleniyor...</p>
                )}
                {form.image && (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="Yeni ürün önizleme" className="h-40 w-full object-cover" />
                  </div>
                )}
              </div>

              <textarea
                placeholder="Açıklama"
                value={form.description}
                className={`${inputClass} min-h-28 resize-none`}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
              <textarea
                placeholder="Uyumlu yazıcı/modeller (örn. LaserJet MFP M135, M137)"
                value={form.printerModels}
                className={`${inputClass} min-h-24 resize-none`}
                onChange={(event) => setForm({ ...form, printerModels: event.target.value })}
              />
              <button
                onClick={addProduct}
                disabled={saving || uploading !== null}
                className="rounded-lg bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : "Ürün Ekle"}
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-950">Toplu Ürün Ekle</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Excel veya CSV dosyasında name, price, image, description, category, brand, printerModels, stock kolonları desteklenir.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/products/import";
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:border-slate-400"
              >
                Şablon
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <input
                type="file"
                accept=".xlsx,.csv"
                className={fileInputClass}
                disabled={importing}
                onChange={(event) => importProducts(event.target.files?.[0])}
              />
              {importing && (
                <p className="text-sm font-semibold text-orange-600">Dosya içe aktarılıyor...</p>
              )}
              {importResult && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-bold text-slate-950">{importResult.message}</p>
                  {(importResult.errors || []).length > 0 && (
                    <ul className="mt-2 grid gap-1 text-red-600">
                      {importResult.errors?.slice(0, 5).map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </section>
        </aside>

        <div className="grid gap-6">
          {editProduct && (
            <section className="rounded-lg border border-orange-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black text-slate-950">Ürün Düzenle</h2>
                <button
                  onClick={() => setEditProduct(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-400"
                >
                  Vazgeç
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <input
                  value={editProduct.name}
                  onChange={(event) => setEditProduct({ ...editProduct, name: event.target.value })}
                  className={inputClass}
                />
                <input
                  value={editProduct.price}
                  onChange={(event) => setEditProduct({ ...editProduct, price: event.target.value })}
                  className={inputClass}
                />
                <input
                  value={editProduct.category || ""}
                  onChange={(event) => setEditProduct({ ...editProduct, category: event.target.value })}
                  className={inputClass}
                />
                <input
                  value={editProduct.brand || ""}
                  onChange={(event) => setEditProduct({ ...editProduct, brand: event.target.value })}
                  className={inputClass}
                  placeholder="Marka"
                />
                <input
                  value={editProduct.stock ?? ""}
                  onChange={(event) =>
                    setEditProduct({
                      ...editProduct,
                      stock: Number(event.target.value || 0),
                    })
                  }
                  className={inputClass}
                  placeholder="Stok"
                />
                <input
                  value={editProduct.image || ""}
                  onChange={(event) => setEditProduct({ ...editProduct, image: event.target.value })}
                  className={inputClass}
                />
                <div className="grid gap-2 md:col-span-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className={fileInputClass}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) uploadImage(file, "edit");
                    }}
                  />
                  {uploading === "edit" && (
                    <p className="text-sm font-semibold text-orange-600">Görsel yükleniyor...</p>
                  )}
                  {editProduct.image && (
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editProduct.image} alt="Ürün önizleme" className="h-48 w-full object-cover" />
                    </div>
                  )}
                </div>
                <textarea
                  value={editProduct.description || ""}
                  onChange={(event) => setEditProduct({ ...editProduct, description: event.target.value })}
                  className={`${inputClass} min-h-28 resize-none md:col-span-2`}
                />
                <textarea
                  value={editProduct.printerModels || ""}
                  onChange={(event) => setEditProduct({ ...editProduct, printerModels: event.target.value })}
                  className={`${inputClass} min-h-24 resize-none md:col-span-2`}
                  placeholder="Uyumlu yazıcı/modeller"
                />
              </div>

              <button
                onClick={updateProduct}
                disabled={saving || uploading !== null}
                className="mt-4 rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Güncelleniyor..." : "Güncelle"}
              </button>
            </section>
          )}

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Ürün Listesi</h2>

            {loading ? (
              <p className="mt-5 text-slate-500">Yükleniyor...</p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="aspect-[4/3] bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image || "/images/yazıcıhp.png"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-black text-slate-950">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {[product.brand, product.category || "Genel"].filter(Boolean).join(" / ")}
                      </p>
                      <p className="mt-3 text-lg font-black text-orange-600">{product.price} TL</p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setEditProduct(product)}
                          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteProduct(product)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
