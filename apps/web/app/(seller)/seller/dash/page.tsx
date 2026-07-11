"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmt } from "@/lib/data/seller";
import { useSellerStats, periodLabels, type StatsPeriod } from "@/lib/data/useSellerStats";
import { useSellerOrders, orderStatusLabels } from "@/lib/data/useOrders";
import type { OrderStatus } from "@treetex/shared";

const periods: StatsPeriod[] = ["day", "week", "month", "year"];

const statusColors: Record<OrderStatus, string> = {
  new: "bg-accent text-white",
  packing: "bg-accent2 text-[#111]",
  shipping: "bg-[#8B5CF6] text-white",
  delivered: "bg-success text-white",
  cancelled: "bg-danger text-white",
  return_requested: "bg-danger text-white",
};

export default function SellerDashPage() {
  const router = useRouter();
  const { orders } = useSellerOrders();
  const [period, setPeriod] = useState<StatsPeriod>("week");
  const { stats, loading } = useSellerStats(period);

  if (loading || !stats) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  const max = Math.max(...stats.chart.bars, 1);

  const kpis = [
    { label: "Дохід", value: fmt(stats.income) },
    { label: "Замовлення", value: String(stats.orderCount) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {periods.map((p) => (
            <span
              key={p}
              onClick={() => setPeriod(p)}
              className="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-extrabold"
              style={{ background: period === p ? "var(--accent)" : "transparent", color: period === p ? "#fff" : "var(--muted)" }}
            >
              {periodLabels[p]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-card border border-border bg-surface p-4.5">
            <div className="text-xs font-bold text-muted">{k.label}</div>
            <div className="mt-1.5 text-2xl font-extrabold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-extrabold">Дохід — {periodLabels[period].toLowerCase()}</div>
            <div className="text-[13px] font-extrabold text-success">{fmt(stats.income)}</div>
          </div>
          <div className="mt-4.5 flex h-[170px] items-end gap-2">
            {stats.chart.bars.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <span className="text-[10px] font-extrabold text-muted">{Math.round((v * 1000) / max / 10) / 100}K</span>
                <div
                  className="w-full max-w-[44px] animate-[growUp_0.5s] rounded-t-lg rounded-b-sm"
                  style={{ height: `${(v / max) * 100}%`, background: v === max ? "var(--accent2)" : "var(--accent)", transformOrigin: "bottom" }}
                />
                <span className="text-[10.5px] font-bold text-muted">{stats.chart.labels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="mb-3.5 text-[15px] font-extrabold">Топ товари</div>
          <div className="flex flex-col gap-3">
            {stats.topProducts.length === 0 && (
              <div className="text-[12.5px] font-semibold text-muted">Немає продажів за цей період</div>
            )}
            {stats.topProducts.map((tp) => (
              <div key={tp.productId} className="flex items-center gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-bold">{tp.name}</div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${tp.pct}%` }} />
                  </div>
                </div>
                <span className="text-[12.5px] font-extrabold">{fmt(tp.revenue)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4.5 rounded-2xl bg-gradient-to-br from-accent to-[#173FA8] p-3.5 text-white">
            <div className="text-[11px] font-extrabold tracking-wider opacity-75">НАСТУПНИЙ ЕФІР</div>
            <div className="mt-1 text-[13.5px] font-extrabold">Сьогодні, 19:00 — Гаджети тижня</div>
            <button
              onClick={() => router.push("/seller/live")}
              className="mt-2.5 rounded-lg bg-accent2 px-3.5 py-2 text-xs font-extrabold text-[#111]"
            >
              Керувати ефіром
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[15px] font-extrabold">Останні замовлення</div>
          <span onClick={() => router.push("/seller/orders")} className="cursor-pointer text-[12.5px] font-extrabold text-accent">
            Усі замовлення →
          </span>
        </div>
        {orders.length === 0 && (
          <div className="py-4 text-center text-[13px] font-semibold text-muted">Замовлень поки немає</div>
        )}
        {orders.slice(0, 4).map((o) => (
          <div key={o.id} className="flex items-center gap-3 border-t border-border py-2.5">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold">{o.orderNo}</div>
              <div className="truncate text-[11.5px] font-semibold text-muted">
                {o.items.length} {o.items.length === 1 ? "товар" : "товари"}
              </div>
            </div>
            <span className="text-[13px] font-extrabold">{fmt(o.sum)}</span>
            <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[o.status]}`}>
              {orderStatusLabels[o.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
