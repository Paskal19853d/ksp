"use client";

import { useState } from "react";
import { useSellerState } from "@/lib/store/SellerStateContext";
import { fmt, imgUrl } from "@/lib/data/seller";
import type { OrderStatus } from "@/lib/data/seller";

const filters: (OrderStatus | "Всі")[] = ["Всі", "Новий", "Пакується", "В дорозі", "Доставлено", "Повернення"];

const statusColors: Record<string, string> = {
  Новий: "bg-accent text-white",
  Пакується: "bg-accent2 text-[#111]",
  "В дорозі": "bg-[#8B5CF6] text-white",
  Доставлено: "bg-success text-white",
  Повернення: "bg-danger text-white",
};

const nextLabels: Record<string, string> = {
  Новий: "→ Пакується",
  Пакується: "→ Відправити",
  "В дорозі": "→ Доставлено",
};

export default function SellerOrdersPage() {
  const { orders, advanceOrder } = useSellerState();
  const [filter, setFilter] = useState<OrderStatus | "Всі">("Всі");

  const rows = filter === "Всі" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <span
            key={f}
            onClick={() => setFilter(f)}
            className="flex-none cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-extrabold"
            style={{
              borderColor: filter === f ? "var(--accent)" : "var(--border)",
              background: filter === f ? "var(--accent)" : "var(--surface)",
              color: filter === f ? "#fff" : "var(--text)",
            }}
          >
            {f === "Всі" ? `Всі (${orders.length})` : f}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {rows.map((o) => (
          <div key={o.no} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <img src={imgUrl(o.seed, 92, 92)} alt="товар" className="h-[46px] w-[46px] rounded-xl object-cover" />
            <div className="min-w-[150px] flex-[2]">
              <div className="text-[13.5px] font-extrabold">
                {o.no} · {fmt(o.sum)}
              </div>
              <div className="text-xs font-semibold text-muted">{o.name}</div>
            </div>
            <div className="min-w-[120px] flex-1">
              <div className="text-[12.5px] font-bold">{o.buyer}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                {o.date} · {o.city}
              </div>
            </div>
            <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[o.status]}`}>
              {o.status}
            </span>
            {nextLabels[o.status] && (
              <button
                onClick={() => advanceOrder(o.no)}
                className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
              >
                {nextLabels[o.status]}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
