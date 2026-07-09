"use client";

import { useState } from "react";
import { useAdminState } from "@/lib/store/AdminStateContext";
import type { AdminReport } from "@/lib/data/admin";

const typeFilters: (AdminReport["type"] | "Всі")[] = ["Всі", "Товар", "Продавець", "Коментар", "Відео"];

const statusColors: Record<string, string> = {
  "На розгляді": "bg-accent2 text-[#111]",
  Схвалено: "bg-success text-white",
  Відхилено: "bg-danger text-white",
};

export default function AdminReportsPage() {
  const { reports, resolveReport } = useAdminState();
  const [filter, setFilter] = useState<AdminReport["type"] | "Всі">("Всі");

  const rows = filter === "Всі" ? reports : reports.filter((r) => r.type === filter);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {typeFilters.map((f) => (
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
            {f === "Всі" ? `Всі (${reports.length})` : f}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {rows.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <span className="rounded-lg bg-surface2 px-2.5 py-1 text-[11px] font-extrabold text-muted">{r.type}</span>
            <div className="min-w-[180px] flex-[2]">
              <div className="text-[13.5px] font-extrabold">{r.target}</div>
              <div className="text-xs font-semibold text-muted">
                Скаржник: {r.reporter} · {r.date}
              </div>
            </div>
            <div className="min-w-[160px] flex-1 text-[12.5px] font-semibold text-muted">{r.reason}</div>
            <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[r.status]}`}>
              {r.status}
            </span>
            {r.status === "На розгляді" && (
              <div className="flex gap-2">
                <button
                  onClick={() => resolveReport(r.id, "Схвалено")}
                  className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
                >
                  Підтвердити
                </button>
                <button
                  onClick={() => resolveReport(r.id, "Відхилено")}
                  className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
                >
                  Відхилити
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
