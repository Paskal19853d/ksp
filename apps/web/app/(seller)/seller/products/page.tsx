"use client";

import { useState } from "react";
import { useSellerState } from "@/lib/store/SellerStateContext";
import { fmt, imgUrl } from "@/lib/data/seller";
import type { SellerProduct } from "@/lib/data/seller";
import { ProductDrawer } from "@/components/seller/ProductDrawer";

export default function SellerProductsPage() {
  const { products, toggleProductActive } = useSellerState();
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<SellerProduct | null>(null);

  const q = query.toLowerCase();
  const rows = products.filter((p) => !q || p.name.toLowerCase().includes(q));

  function openNew() {
    setEditProduct(null);
    setDrawerOpen(true);
  }

  function openEdit(p: SellerProduct) {
    setEditProduct(p);
    setDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук у каталозі…"
          className="min-w-[200px] flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-[13.5px] font-semibold outline-none"
        />
        <button
          onClick={openNew}
          className="rounded-xl bg-accent px-5 py-3 text-[13.5px] font-extrabold text-white hover:brightness-110"
        >
          + Новий товар
        </button>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {rows.map((p) => {
          const stockLabel = p.stock === 0 ? "Немає в наявності" : p.stock < 10 ? `Мало: ${p.stock} шт` : `${p.stock} шт`;
          const stockColor = p.stock === 0 ? "var(--danger)" : p.stock < 10 ? "var(--accent2)" : "var(--muted)";
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-3.5 last:border-0">
              <img src={imgUrl(p.seed, 96, 112)} alt={p.name} className="h-14 w-12 rounded-xl object-cover" />
              <div className="min-w-[170px] flex-[2]">
                <div className="text-[13.5px] font-extrabold">{p.name}</div>
                <div className="text-[11.5px] font-semibold text-muted">
                  Арт. {p.sku} · {p.cat}
                </div>
              </div>
              <div className="min-w-[90px] flex-1">
                <div className="text-[13.5px] font-extrabold">{fmt(p.price)}</div>
                <div className="mt-0.5 text-[11.5px] font-bold" style={{ color: stockColor }}>
                  {stockLabel}
                </div>
              </div>
              <div className="min-w-[88px] text-xs font-bold text-muted">{p.sales} продажів</div>
              <span
                onClick={() => toggleProductActive(p.id)}
                className="cursor-pointer whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-extrabold"
                style={{
                  background: p.active ? "var(--success)" : "var(--surface2)",
                  color: p.active ? "#fff" : "var(--muted)",
                  borderColor: p.active ? "transparent" : "var(--border)",
                }}
              >
                {p.active ? "Активний" : "Прихований"}
              </span>
              <button
                onClick={() => openEdit(p)}
                className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
              >
                Редагувати
              </button>
            </div>
          );
        })}
      </div>

      <ProductDrawer open={drawerOpen} editProduct={editProduct} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
