"use client";

import { useState } from "react";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { useAdminCategories } from "@/lib/data/useCategories";
import { Switch } from "@/components/ui/Switch";
import { ApiError } from "@/lib/api";

export default function AdminCategoriesPage() {
  const { categories, loading, create, setVisible } = useAdminCategories();
  const { showToast } = useAdminState();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate() {
    if (!name.trim() || !icon.trim()) {
      showToast("Вкажіть назву та іконку");
      return;
    }
    setSubmitting(true);
    try {
      await create({ name: name.trim(), icon: icon.trim() });
      setName("");
      setIcon("");
      showToast("Категорію створено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося створити категорію");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id: number, visible: boolean) {
    try {
      await setVisible(id, visible);
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося оновити категорію");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2.5 rounded-card border border-border bg-surface p-4.5">
        <input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="🎁"
          className="w-16 rounded-[10px] border border-border bg-bg px-3 py-2.5 text-center text-lg outline-none"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Назва нової категорії"
          className="min-w-[200px] flex-1 rounded-[10px] border border-border bg-bg px-3.5 py-2.5 text-[13.5px] font-semibold outline-none"
        />
        <button
          onClick={handleCreate}
          disabled={submitting}
          className="rounded-[10px] bg-accent px-4 py-2.5 text-xs font-extrabold text-white hover:brightness-110 disabled:opacity-50"
        >
          Додати категорію
        </button>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <span className="text-2xl">{c.icon}</span>
            <div className="flex-1">
              <div className="text-[13.5px] font-extrabold">{c.name}</div>
              <div className="text-[11.5px] font-semibold text-muted">{c.productCount.toLocaleString("uk-UA")} товарів</div>
            </div>
            <Switch
              checked={c.visible}
              onChange={() => handleToggle(c.id, !c.visible)}
              label={c.visible ? "Показана" : "Прихована"}
            />
          </div>
        ))}
        {categories.length === 0 && (
          <div className="p-6 text-center text-[13px] font-semibold text-muted">Ще немає категорій</div>
        )}
      </div>
    </div>
  );
}
