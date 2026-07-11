"use client";

import { useState } from "react";
import { fmt } from "@/lib/data/seller";
import { useSellerOrders, orderStatusLabels } from "@/lib/data/useOrders";
import { api, ApiError } from "@/lib/api";
import type { OrderStatus } from "@treetex/shared";
import { useSellerState } from "@/lib/store/SellerStateContext";

const filters: (OrderStatus | "all")[] = [
  "all",
  "new",
  "packing",
  "shipping",
  "delivered",
  "return_requested",
];

const statusColors: Record<OrderStatus, string> = {
  new: "bg-accent text-white",
  packing: "bg-accent2 text-[#111]",
  shipping: "bg-[#8B5CF6] text-white",
  delivered: "bg-success text-white",
  cancelled: "bg-danger text-white",
  return_requested: "bg-danger text-white",
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "packing",
  packing: "shipping",
  shipping: "delivered",
};

const nextLabels: Partial<Record<OrderStatus, string>> = {
  new: "→ Пакується",
  packing: "→ Відправити",
  shipping: "→ Доставлено",
};

export default function SellerOrdersPage() {
  const { orders, loading, reload } = useSellerOrders();
  const { showToast } = useSellerState();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const rows = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  async function advance(orderId: number, status: OrderStatus) {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      await reload();
      showToast("Статус замовлення оновлено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося оновити статус");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

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
            {f === "all" ? `Всі (${orders.length})` : orderStatusLabels[f]}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {rows.length === 0 && (
          <div className="p-6 text-center text-[13px] font-semibold text-muted">Замовлень немає</div>
        )}
        {rows.map((o) => (
          <div key={o.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <div className="min-w-[150px] flex-[2]">
              <div className="text-[13.5px] font-extrabold">
                {o.orderNo} · {fmt(o.sum)}
              </div>
              <div className="text-xs font-semibold text-muted">
                {o.items.length} {o.items.length === 1 ? "товар" : "товари"}
              </div>
            </div>
            <div className="min-w-[120px] flex-1">
              <div className="text-[12.5px] font-bold">{o.recipientName}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                {new Date(o.createdAt).toLocaleDateString("uk-UA")} · {o.city}
              </div>
            </div>
            <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[o.status]}`}>
              {orderStatusLabels[o.status]}
            </span>
            {nextStatus[o.status] && (
              <button
                onClick={() => advance(o.id, nextStatus[o.status]!)}
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
