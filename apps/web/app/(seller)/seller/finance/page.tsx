"use client";

import { useSellerState } from "@/lib/store/SellerStateContext";
import { payouts } from "@/lib/data/seller";

export default function SellerFinancePage() {
  const { showToast } = useSellerState();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-card bg-gradient-to-br from-accent to-[#173FA8] p-6 text-white">
          <div className="text-xs font-bold opacity-80">Доступно до виплати</div>
          <div className="mt-1.5 text-[34px] font-extrabold">84 320 ₴</div>
          <div className="mt-1.5 text-xs font-semibold opacity-75">
            Комісія платформи 8% · Наступна автовиплата — п'ятниця
          </div>
          <button
            onClick={() => showToast("Заявку на виплату 84 320 ₴ створено")}
            className="mt-4 rounded-xl bg-accent2 px-6 py-3 text-[13.5px] font-extrabold text-[#111] hover:brightness-105"
          >
            Вивести кошти
          </button>
        </div>
        <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5">
          <div className="text-[15px] font-extrabold">Зведення за місяць</div>
          <div className="flex justify-between text-[13.5px] font-semibold text-muted">
            <span>Продажі</span>
            <span className="font-extrabold text-text">284 350 ₴</span>
          </div>
          <div className="flex justify-between text-[13.5px] font-semibold text-muted">
            <span>Дохід від ефірів</span>
            <span className="font-extrabold text-text">96 120 ₴</span>
          </div>
          <div className="flex justify-between text-[13.5px] font-semibold text-muted">
            <span>Комісія платформи</span>
            <span className="font-extrabold text-danger">−30 438 ₴</span>
          </div>
          <div className="flex justify-between text-[13.5px] font-semibold text-muted">
            <span>Повернення</span>
            <span className="font-extrabold text-danger">−4 180 ₴</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-[15px] font-extrabold">
            <span>Чистий дохід</span>
            <span className="text-success">345 852 ₴</span>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-5">
        <div className="mb-3 text-[15px] font-extrabold">Історія виплат</div>
        {payouts.map((p, i) => (
          <div key={i} className="flex items-center gap-3.5 border-t border-border py-3">
            <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-surface2 text-[15px]">↧</div>
            <div className="flex-1">
              <div className="text-[13px] font-extrabold">{p.title}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                {p.date} · {p.card}
              </div>
            </div>
            <span className="text-sm font-extrabold">{p.sum}</span>
            <span className="rounded-lg bg-success px-2.5 py-1 text-[11px] font-extrabold text-white">Зараховано</span>
          </div>
        ))}
      </div>
    </div>
  );
}
