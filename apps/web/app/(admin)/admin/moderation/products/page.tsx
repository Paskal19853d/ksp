"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { imgUrl } from "@/lib/data/products";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function AdminModerationProductsPage() {
  const { products, resolveProduct } = useAdminState();
  const pending = products.filter((p) => p.status === "На розгляді");

  if (pending.length === 0) return <ComingSoon title="Немає товарів на розгляді" />;

  return (
    <div className="flex flex-col gap-2.5">
      {pending.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
          <img src={imgUrl(p.seed, 90, 90)} alt={p.name} className="h-[54px] w-[54px] rounded-xl object-cover" />
          <div className="min-w-[200px] flex-[2]">
            <div className="text-[13.5px] font-extrabold">{p.name}</div>
            <div className="mt-0.5 text-[12.5px] font-semibold text-muted">Продавець: {p.seller}</div>
            <div className="mt-1 text-[11.5px] font-bold text-danger">{p.reason}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => resolveProduct(p.id, "Схвалено")}
              className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
            >
              Схвалити
            </button>
            <button
              onClick={() => resolveProduct(p.id, "Відхилено")}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
            >
              Зняти з публікації
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
