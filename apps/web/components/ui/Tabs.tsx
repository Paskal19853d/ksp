"use client";

import { cn } from "@/lib/cn";

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto border-b border-border no-scrollbar">
      {items.map((t, i) => (
        <span
          key={t}
          onClick={() => onChange(i)}
          className={cn(
            "cursor-pointer whitespace-nowrap px-4 py-2.5 text-[13.5px] font-extrabold border-b-[2.5px]",
            active === i ? "text-text border-accent" : "text-muted border-transparent"
          )}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function Pagination({
  total,
  page,
  onChange,
}: {
  total: number;
  page: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          onClick={() => onChange(n)}
          className={cn(
            "flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] text-[13px] font-extrabold",
            page === n ? "bg-accent text-white" : "border border-border text-muted"
          )}
        >
          {n}
        </span>
      ))}
      {total > 5 && (
        <>
          <span className="px-1.5 text-[13px] font-bold text-muted">…</span>
          <span className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-border text-[13px] font-extrabold text-muted">
            {total}
          </span>
        </>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="text-[12.5px] font-bold text-muted">
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span className="text-text">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="px-1.5">/</span>}
        </span>
      ))}
    </div>
  );
}
