"use client";

import Link from "next/link";
import { orders } from "@/lib/data/products";

const transactions = [
  { title: "Поповнення гаманця", date: "6 липня", sum: "+1 500 ₴", positive: true },
  ...orders.map((o) => ({ title: `Замовлення ${o.no}`, date: o.date, sum: `−${o.sum}`, positive: false })),
  { title: "Кешбек за замовлення TX-284913", date: "28 червня", sum: "+64 ₴", positive: true },
];

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-[640px] px-4 pb-[120px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Гаманець</h1>
      </div>

      <div className="rounded-card bg-accent p-4.5 text-white">
        <div className="text-xs font-bold opacity-80">Баланс гаманця</div>
        <div className="mt-1 text-[28px] font-extrabold">1 240 ₴</div>
        <div className="mt-3.5 flex gap-2.5">
          <button className="flex-1 rounded-xl bg-white/15 py-2.5 text-[13px] font-extrabold hover:bg-white/25">
            Поповнити
          </button>
          <button className="flex-1 rounded-xl bg-white/15 py-2.5 text-[13px] font-extrabold hover:bg-white/25">
            Вивести
          </button>
        </div>
      </div>

      <h2 className="mb-2.5 mt-5.5 text-base font-extrabold">Історія операцій</h2>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {transactions.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-border px-4.5 py-3.5 last:border-0"
          >
            <div>
              <div className="text-[13px] font-extrabold">{t.title}</div>
              <div className="text-[11.5px] font-semibold text-muted">{t.date}</div>
            </div>
            <span className={`text-[13.5px] font-extrabold ${t.positive ? "text-success" : "text-text"}`}>
              {t.sum}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
