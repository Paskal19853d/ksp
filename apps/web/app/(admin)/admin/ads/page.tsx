"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { imgUrl } from "@/lib/data/products";

const statusColors: Record<string, string> = {
  Активна: "bg-success text-white",
  "На паузі": "bg-accent2 text-[#111]",
  Завершена: "bg-surface2 text-muted",
};

export default function AdminAdsPage() {
  const { ads, toggleAdStatus } = useAdminState();

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      {ads.map((a) => (
        <div key={a.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
          <img src={imgUrl(a.seed, 90, 90)} alt={a.product} className="h-[54px] w-[54px] rounded-xl object-cover" />
          <div className="min-w-[180px] flex-[2]">
            <div className="text-[13.5px] font-extrabold">{a.product}</div>
            <div className="text-[11.5px] font-semibold text-muted">{a.seller}</div>
          </div>
          <div className="min-w-[120px] flex-1 text-[12.5px] font-bold">
            {a.spent} <span className="text-muted">/ {a.budget}</span>
          </div>
          <div className="min-w-[90px] text-[12.5px] font-extrabold">{a.clicks.toLocaleString("uk-UA")} кліків</div>
          <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[a.status]}`}>
            {a.status}
          </span>
          {a.status !== "Завершена" && (
            <button
              onClick={() => toggleAdStatus(a.id)}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
            >
              {a.status === "Активна" ? "Призупинити" : "Відновити"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
