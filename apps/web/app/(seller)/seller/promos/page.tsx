"use client";

import { useState } from "react";
import { useSellerState } from "@/lib/store/SellerStateContext";

export default function SellerPromosPage() {
  const { coupons, addCoupon, removeCoupon } = useSellerState();
  const [code, setCode] = useState("");
  const [pct, setPct] = useState("");

  function handleAdd() {
    addCoupon(code, parseInt(pct, 10));
    setCode("");
    setPct("");
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2.5">
        <div className="mb-0.5 text-[15px] font-extrabold">Активні купони</div>
        {coupons.map((c) => (
          <div
            key={c.id}
            className="flex animate-slideUp items-center gap-3.5 rounded-card border border-dashed border-border bg-surface p-4"
          >
            <div className="rounded-xl bg-accent2 px-3.5 py-2.5 text-base font-extrabold tracking-wide text-[#111]">
              −{c.pct}%
            </div>
            <div className="flex-1">
              <div className="text-sm font-extrabold tracking-wide">{c.code}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                до {c.until} · використано {c.used} разів
              </div>
            </div>
            <span
              onClick={() => removeCoupon(c.id)}
              className="cursor-pointer text-xs font-extrabold text-muted hover:text-danger"
            >
              Зупинити
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 self-start rounded-card border border-border bg-surface p-5">
        <div className="text-[15px] font-extrabold">Створити купон</div>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Код, напр. SUMMER26"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <input
          value={pct}
          onChange={(e) => setPct(e.target.value)}
          placeholder="Знижка, % (1–90)"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <button
          onClick={handleAdd}
          className="rounded-xl bg-accent py-3.5 text-[13.5px] font-extrabold text-white hover:brightness-110"
        >
          Створити купон
        </button>
        <div className="text-[11.5px] font-semibold leading-relaxed text-muted">
          Купон діє 30 днів на весь каталог. Покупці побачать його в картках товарів і під час ефірів.
        </div>
      </div>
    </div>
  );
}
