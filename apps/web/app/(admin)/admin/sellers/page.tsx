"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { usePendingSellers, useAllSellersAdmin, sellerStatusLabel, formatRevenue } from "@/lib/data/useAdminSellers";
import { ApiError } from "@/lib/api";

const statusColors: Record<string, string> = {
  approved: "bg-success text-white",
  pending: "bg-accent2 text-[#111]",
  rejected: "bg-danger text-white",
};

export default function AdminSellersPage() {
  const { sellers: pending, loading: pendingLoading, resolve: resolvePending } = usePendingSellers();
  const { sellers: all, loading: allLoading, resolve: resolveAll } = useAllSellersAdmin();
  const { showToast } = useAdminState();

  const resolved = all.filter((s) => s.sellerStatus !== "pending");

  async function handleResolve(id: number, status: "approved" | "rejected") {
    try {
      await Promise.all([resolvePending(id, status), resolveAll(id, status)]);
      showToast(status === "approved" ? "Продавця схвалено" : "Продавця відхилено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося обробити заявку");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!pendingLoading && pending.length > 0 && (
        <div>
          <h2 className="mb-2.5 text-[15px] font-extrabold">Нові заявки на розгляді</h2>
          <div className="flex flex-col gap-2.5">
            {pending.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-dashed border-accent bg-surface p-4.5">
                <div className="min-w-[160px] flex-[2]">
                  <div className="text-[13.5px] font-extrabold">{s.name}</div>
                  <div className="text-xs font-semibold text-muted">
                    {s.email} · {s.storeCategory ?? "—"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolve(s.id, "approved")}
                    className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
                  >
                    Схвалити
                  </button>
                  <button
                    onClick={() => handleResolve(s.id, "rejected")}
                    className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
                  >
                    Відхилити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-2.5 text-[15px] font-extrabold">Всі продавці</h2>
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          {allLoading && <div className="py-10 text-center text-[13px] font-semibold text-muted">Завантаження…</div>}
          {!allLoading &&
            resolved.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
                <div className="min-w-[140px] flex-[2]">
                  <div className="text-[13.5px] font-extrabold">{s.name}</div>
                  <div className="text-xs font-semibold text-muted">
                    {s.storeCategory ?? "—"} · {s.productCount} товарів
                  </div>
                </div>
                <div className="min-w-[100px] flex-1 text-[12.5px] font-extrabold">{formatRevenue(s.revenue)}</div>
                <div className="min-w-[70px] text-[12.5px] font-extrabold text-accent2">
                  {s.rating > 0 ? `★ ${s.rating.toFixed(1)}` : "—"}
                </div>
                <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[s.sellerStatus ?? "pending"]}`}>
                  {sellerStatusLabel(s.sellerStatus)}
                </span>
                {s.sellerStatus === "approved" && (
                  <button
                    onClick={() => handleResolve(s.id, "rejected")}
                    className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
                  >
                    Відкликати
                  </button>
                )}
                {s.sellerStatus === "rejected" && (
                  <button
                    onClick={() => handleResolve(s.id, "approved")}
                    className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
                  >
                    Схвалити
                  </button>
                )}
              </div>
            ))}
          {!allLoading && resolved.length === 0 && (
            <div className="py-10 text-center text-[13px] font-semibold text-muted">Ще немає продавців</div>
          )}
        </div>
      </div>
    </div>
  );
}
