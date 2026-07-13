"use client";

import { useState } from "react";
import type { ReportTargetType } from "@treetex/shared";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { useAllReports, usePendingReports } from "@/lib/data/useReports";
import { ApiError } from "@/lib/api";

const typeFilters: (ReportTargetType | "all")[] = ["all", "product", "review", "chat_message"];

const typeLabels: Record<ReportTargetType, string> = {
  product: "Товар",
  review: "Відгук",
  chat_message: "Повідомлення в чаті",
};

const statusLabels: Record<string, string> = {
  pending: "На розгляді",
  approved: "Схвалено",
  rejected: "Відхилено",
};

const statusColors: Record<string, string> = {
  pending: "bg-accent2 text-[#111]",
  approved: "bg-success text-white",
  rejected: "bg-danger text-white",
};

export default function AdminReportsPage() {
  const { reports, loading } = useAllReports();
  const { resolve } = usePendingReports();
  const { showToast } = useAdminState();
  const [filter, setFilter] = useState<ReportTargetType | "all">("all");

  const rows = filter === "all" ? reports : reports.filter((r) => r.targetType === filter);

  async function handleResolve(id: number, status: "approved" | "rejected") {
    try {
      await resolve(id, status);
      showToast(status === "approved" ? "Скаргу підтверджено" : "Скаргу відхилено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося обробити скаргу");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

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
            {f === "all" ? `Всі (${reports.length})` : typeLabels[f]}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {rows.length === 0 && (
          <div className="p-6 text-center text-[13px] font-semibold text-muted">Скарг немає</div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <span className="rounded-lg bg-surface2 px-2.5 py-1 text-[11px] font-extrabold text-muted">
              {typeLabels[r.targetType]}
            </span>
            <div className="min-w-[180px] flex-[2]">
              <div className="text-[13.5px] font-extrabold">#{r.targetId}</div>
              <div className="text-xs font-semibold text-muted">
                Скаржник: користувач #{r.reporterId} · {new Date(r.createdAt).toLocaleDateString("uk-UA")}
              </div>
            </div>
            <div className="min-w-[160px] flex-1 text-[12.5px] font-semibold text-muted">{r.reason}</div>
            <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[r.status]}`}>
              {statusLabels[r.status]}
            </span>
            {r.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleResolve(r.id, "approved")}
                  className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
                >
                  Підтвердити
                </button>
                <button
                  onClick={() => handleResolve(r.id, "rejected")}
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
