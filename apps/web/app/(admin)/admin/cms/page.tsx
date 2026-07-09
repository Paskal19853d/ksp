"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { Switch } from "@/components/ui/Switch";

export default function AdminCmsPage() {
  const { pages, togglePagePublished } = useAdminState();

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      {pages.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
          <div className="min-w-[200px] flex-[2]">
            <div className="text-[13.5px] font-extrabold">{p.title}</div>
            <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
              {p.slug} · оновлено {p.updated}
            </div>
          </div>
          <button className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent">
            Редагувати
          </button>
          <Switch
            checked={p.published}
            onChange={() => togglePagePublished(p.id)}
            label={p.published ? "Опубліковано" : "Чернетка"}
          />
        </div>
      ))}
    </div>
  );
}
