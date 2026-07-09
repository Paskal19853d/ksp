"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { adminDashboard, adminReports } from "@/lib/data/admin";

const severityColors: Record<string, string> = {
  danger: "text-danger",
  warning: "text-accent2",
};

export default function AdminDashPage() {
  const { sellers } = useAdminState();
  const max = Math.max(...adminDashboard.bars);
  const pendingSellers = sellers.filter((s) => s.status === "На розгляді").length;

  const kpis = [
    { label: "Користувачів", value: adminDashboard.totalUsers, delta: "↑ 4,1% за місяць" },
    { label: "Продавців", value: adminDashboard.totalSellers, delta: `${pendingSellers} на розгляді` },
    { label: "Замовлень", value: adminDashboard.totalOrders, delta: "↑ 9,3% за місяць" },
    { label: "GMV (обіг)", value: adminDashboard.gmv, delta: "↑ 14,7% за місяць" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-card border border-border bg-surface p-4.5">
            <div className="text-xs font-bold text-muted">{k.label}</div>
            <div className="mt-1.5 text-2xl font-extrabold">{k.value}</div>
            <div className="mt-1.5 text-[11.5px] font-extrabold text-success">{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="text-[15px] font-extrabold">GMV платформи — 12 місяців</div>
          <div className="mt-4.5 flex h-[170px] items-end gap-2">
            {adminDashboard.bars.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full max-w-[28px] rounded-t-lg rounded-b-sm"
                  style={{ height: `${(v / max) * 100}%`, background: v === max ? "var(--accent2)" : "var(--accent)" }}
                />
                <span className="text-[10.5px] font-bold text-muted">{adminDashboard.labels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="mb-3.5 text-[15px] font-extrabold">Активні скарги</div>
          <div className="flex flex-col gap-3">
            {adminReports.map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-[12.5px] font-bold">{r.label}</span>
                <span className={`text-[13px] font-extrabold ${severityColors[r.severity]}`}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
