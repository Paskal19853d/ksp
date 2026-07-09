"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { avatarUrl } from "@/lib/data/admin";

const statusColors: Record<string, string> = {
  Схвалено: "bg-success text-white",
  "На розгляді": "bg-accent2 text-[#111]",
  Відхилено: "bg-danger text-white",
};

export default function AdminSellersPage() {
  const { sellers, approveSeller, rejectSeller } = useAdminState();
  const pending = sellers.filter((s) => s.status === "На розгляді");
  const resolved = sellers.filter((s) => s.status !== "На розгляді");

  return (
    <div className="flex flex-col gap-4">
      {pending.length > 0 && (
        <div>
          <h2 className="mb-2.5 text-[15px] font-extrabold">Нові заявки на розгляді</h2>
          <div className="flex flex-col gap-2.5">
            {pending.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-dashed border-accent bg-surface p-4.5">
                <img src={avatarUrl(s.av)} alt={s.name} className="h-11 w-11 rounded-2xl object-cover" />
                <div className="min-w-[160px] flex-[2]">
                  <div className="text-[13.5px] font-extrabold">{s.name}</div>
                  <div className="text-xs font-semibold text-muted">{s.email} · {s.category}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveSeller(s.id)}
                    className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
                  >
                    Схвалити
                  </button>
                  <button
                    onClick={() => rejectSeller(s.id)}
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
          {resolved.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
              <img src={avatarUrl(s.av)} alt={s.name} className="h-11 w-11 rounded-2xl object-cover" />
              <div className="min-w-[140px] flex-[2]">
                <div className="text-[13.5px] font-extrabold">{s.name}</div>
                <div className="text-xs font-semibold text-muted">{s.category} · {s.products} товарів</div>
              </div>
              <div className="min-w-[100px] flex-1 text-[12.5px] font-extrabold">{s.revenue}</div>
              <div className="min-w-[70px] text-[12.5px] font-extrabold text-accent2">
                {s.rating > 0 ? `★ ${s.rating}` : "—"}
              </div>
              <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[s.status]}`}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
