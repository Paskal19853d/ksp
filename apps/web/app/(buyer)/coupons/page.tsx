"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store/AppStateContext";

const availableCoupons = [
  { code: "TREE10", pct: 10, until: "31 липня", desc: "Знижка на будь-яке замовлення від 500 ₴" },
  { code: "LIVE30", pct: 30, until: "лише під час ефірів", desc: "Діє тільки на товари з прямого ефіру" },
];

export default function CouponsPage() {
  const { showToast } = useAppState();

  function copyCode(code: string) {
    navigator.clipboard?.writeText(code).catch(() => {});
    showToast(`Код ${code} скопійовано ✓`);
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 pb-[120px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Купони та бонуси</h1>
      </div>

      <div className="rounded-card border border-border bg-surface p-4.5">
        <div className="text-xs font-bold text-muted">Бонуси TREETEX</div>
        <div className="mt-1 text-2xl font-extrabold text-accent2">380</div>
        <div className="mt-1.5 text-[12px] font-semibold text-muted">
          1 бонус = 1 ₴ знижки під час оформлення замовлення
        </div>
      </div>

      <h2 className="mb-2.5 mt-5.5 text-base font-extrabold">Доступні купони</h2>
      <div className="flex flex-col gap-2.5">
        {availableCoupons.map((c) => (
          <div
            key={c.code}
            className="flex items-center gap-3.5 rounded-card border border-dashed border-accent bg-surface p-3.5"
          >
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-accent text-base font-extrabold text-white">
              −{c.pct}%
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-extrabold">{c.code}</div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-muted">{c.desc}</div>
              <div className="mt-0.5 text-[11px] font-bold text-muted">Діє до: {c.until}</div>
            </div>
            <button
              onClick={() => copyCode(c.code)}
              className="rounded-[10px] bg-accent2 px-3.5 py-2 text-[11.5px] font-extrabold text-[#111] hover:brightness-105"
            >
              Копіювати
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
