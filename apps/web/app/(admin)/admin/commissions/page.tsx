"use client";

import { useState } from "react";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { useCommissionRules } from "@/lib/data/useFinance";
import { useCategories } from "@/lib/data/useCategories";
import { ApiError } from "@/lib/api";

export default function AdminCommissionsPage() {
  const { rules, loading, setRate } = useCommissionRules();
  const { categories, loading: categoriesLoading } = useCategories();
  const { showToast } = useAdminState();
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  async function save(categoryId: number) {
    const value = drafts[categoryId];
    if (value === undefined || value === "") return;
    const pct = parseInt(value, 10);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      showToast("Ставка має бути числом від 0 до 100");
      return;
    }
    try {
      await setRate(categoryId, pct);
      setDrafts((d) => ({ ...d, [categoryId]: "" }));
      showToast("Комісію оновлено ✓");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося оновити комісію");
    }
  }

  if (loading || categoriesLoading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-[13px] font-semibold text-muted">
        Комісія платформи стягується з кожного продажу в межах категорії. Зміни діють для нових замовлень.
      </p>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {categories.map((c) => {
          const rule = rules.find((r) => r.categoryId === c.id);
          return (
            <div key={c.id} className="flex items-center gap-3.5 border-b border-border p-4.5 last:border-0">
              <span className="flex-1 text-[13.5px] font-extrabold">{c.name}</span>
              <span className="text-lg font-extrabold text-accent2">{rule ? `${rule.pct}%` : "—"}</span>
              <input
                value={drafts[c.id] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                placeholder="Нова ставка, %"
                className="w-[140px] rounded-[10px] border border-border bg-bg px-3.5 py-2.5 text-[12.5px] font-semibold outline-none"
              />
              <button
                onClick={() => save(c.id)}
                className="rounded-[10px] bg-accent px-3.5 py-2.5 text-xs font-extrabold text-white hover:brightness-110"
              >
                Зберегти
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
