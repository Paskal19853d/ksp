"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { Switch } from "@/components/ui/Switch";

export default function AdminCategoriesPage() {
  const { categories, toggleCategoryVisible } = useAdminState();

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      {categories.map((c) => (
        <div key={c.id} className="flex items-center gap-3.5 border-b border-border p-4.5 last:border-0">
          <span className="text-2xl">{c.icon}</span>
          <div className="flex-1">
            <div className="text-[13.5px] font-extrabold">{c.name}</div>
            <div className="text-[11.5px] font-semibold text-muted">{c.products.toLocaleString("uk-UA")} товарів</div>
          </div>
          <Switch
            checked={c.visible}
            onChange={() => toggleCategoryVisible(c.id)}
            label={c.visible ? "Показана" : "Прихована"}
          />
        </div>
      ))}
    </div>
  );
}
