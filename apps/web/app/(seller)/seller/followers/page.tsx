"use client";

import { sellerFollowers, avatarUrl } from "@/lib/data/seller";

export default function SellerFollowersPage() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">Всього підписників</div>
          <div className="mt-1 text-2xl font-extrabold">48 300</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">Нових цього місяця</div>
          <div className="mt-1 text-2xl font-extrabold text-success">+612</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">Купують повторно</div>
          <div className="mt-1 text-2xl font-extrabold text-accent">34%</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {sellerFollowers.map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-3 border-b border-border p-3.5 last:border-0 hover:bg-surface2"
          >
            <img src={avatarUrl(f.av)} alt={f.name} className="h-11 w-11 rounded-2xl object-cover" />
            <div className="flex-1">
              <div className="text-[13px] font-extrabold">{f.name}</div>
              <div className="text-[11.5px] font-semibold text-muted">Підписаний {f.since}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-extrabold">{f.orders}</div>
              <div className="text-[10.5px] font-bold text-muted">замовлень</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
