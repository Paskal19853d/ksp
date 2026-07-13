"use client";

import { useAdminDashboard, formatGmv, pendingReportLabels } from "@/lib/data/useAdminDashboard";

export default function AdminDashPage() {
  const { dashboard, loading } = useAdminDashboard();

  if (loading || !dashboard) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  const max = Math.max(...dashboard.gmvTrend.bars, 1);

  const kpis = [
    { label: "Користувачів", value: dashboard.totalUsers.toLocaleString("uk-UA") },
    { label: "Продавців", value: dashboard.totalSellers.toLocaleString("uk-UA") },
    { label: "Замовлень", value: dashboard.totalOrders.toLocaleString("uk-UA") },
    { label: "GMV (обіг)", value: formatGmv(dashboard.gmv) },
  ];

  const reportEntries = Object.entries(dashboard.pendingReports) as [
    keyof typeof dashboard.pendingReports,
    number,
  ][];

  return (
    <div className="flex flex-col gap-4">
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
          <div className="text-[15px] font-extrabold">GMV платформи — 12 місяців</div>
          <div className="mt-4.5 flex h-[170px] items-end gap-2">
            {dashboard.gmvTrend.bars.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full max-w-[28px] rounded-t-lg rounded-b-sm"
                  style={{ height: `${(v / max) * 100}%`, background: v === max && v > 0 ? "var(--accent2)" : "var(--accent)" }}
                />
                <span className="text-[10.5px] font-bold text-muted">{dashboard.gmvTrend.labels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="mb-3.5 text-[15px] font-extrabold">Скарги на розгляді</div>
          <div className="flex flex-col gap-3">
            {reportEntries.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold">{pendingReportLabels[type]}</span>
                <span className={`text-[13px] font-extrabold ${count > 0 ? "text-danger" : "text-muted"}`}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
