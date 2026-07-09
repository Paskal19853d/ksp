"use client";

import { useState } from "react";
import { useAdminState } from "@/lib/store/AdminStateContext";

export default function AdminCommissionsPage() {
  const { commissions, setCommission } = useAdminState();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function save(category: string) {
    const value = drafts[category];
    if (value === undefined) return;
    setCommission(category, parseInt(value, 10));
    setDrafts((d) => ({ ...d, [category]: "" }));
  }

  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-[13px] font-semibold text-muted">
        Комісія платформи стягується з кожного продажу в межах категорії. Зміни діють одразу для всіх продавців.
      </p>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {commissions.map((c) => (
          <div key={c.category} className="flex items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <span className="flex-1 text-[13.5px] font-extrabold">{c.category}</span>
            <span className="text-lg font-extrabold text-accent2">{c.pct}%</span>
            <input
              value={drafts[c.category] ?? ""}
              onChange={(e) => setDrafts((d) => ({ ...d, [c.category]: e.target.value }))}
              placeholder="Нова ставка, %"
              className="w-[140px] rounded-[10px] border border-border bg-bg px-3.5 py-2.5 text-[12.5px] font-semibold outline-none"
            />
            <button
              onClick={() => save(c.category)}
              className="rounded-[10px] bg-accent px-3.5 py-2.5 text-xs font-extrabold text-white hover:brightness-110"
            >
              Зберегти
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
