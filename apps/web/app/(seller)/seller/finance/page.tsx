"use client";

import { useSellerState } from "@/lib/store/SellerStateContext";
import { useSellerBalance, useSellerPayouts } from "@/lib/data/useFinance";
import { ApiError } from "@/lib/api";

export default function SellerFinancePage() {
  const { showToast } = useSellerState();
  const { balance, loading: balanceLoading } = useSellerBalance();
  const { payouts, loading: payoutsLoading, requestPayout } = useSellerPayouts();

  async function handleRequestPayout() {
    try {
      await requestPayout();
      showToast("Заявку на виплату створено ✓");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося створити заявку на виплату");
    }
  }

  if (balanceLoading || payoutsLoading || !balance) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-card bg-gradient-to-br from-accent to-[#173FA8] p-6 text-white">
          <div className="text-xs font-bold opacity-80">Доступно до виплати</div>
          <div className="mt-1.5 text-[34px] font-extrabold">{balance.netAmount.toLocaleString("uk-UA")} ₴</div>
          <div className="mt-1.5 text-xs font-semibold opacity-75">
            Продажі {balance.gmv.toLocaleString("uk-UA")} ₴ · Комісія платформи {balance.commission.toLocaleString("uk-UA")} ₴
          </div>
          <button
            onClick={handleRequestPayout}
            disabled={balance.netAmount <= 0}
            className="mt-4 rounded-xl bg-accent2 px-6 py-3 text-[13.5px] font-extrabold text-[#111] hover:brightness-105 disabled:opacity-40"
          >
            Вивести кошти
          </button>
        </div>
        <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5">
          <div className="text-[15px] font-extrabold">Поточний баланс</div>
          <div className="flex justify-between text-[13.5px] font-semibold text-muted">
            <span>Продажі (ще не виплачено)</span>
            <span className="font-extrabold text-text">{balance.gmv.toLocaleString("uk-UA")} ₴</span>
          </div>
          <div className="flex justify-between text-[13.5px] font-semibold text-muted">
            <span>Комісія платформи</span>
            <span className="font-extrabold text-danger">−{balance.commission.toLocaleString("uk-UA")} ₴</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-[15px] font-extrabold">
            <span>До виплати</span>
            <span className="text-success">{balance.netAmount.toLocaleString("uk-UA")} ₴</span>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-5">
        <div className="mb-3 text-[15px] font-extrabold">Історія виплат</div>
        {payouts.length === 0 && (
          <div className="py-4 text-center text-[13px] font-semibold text-muted">Виплат ще не було</div>
        )}
        {payouts.map((p) => (
          <div key={p.id} className="flex items-center gap-3.5 border-t border-border py-3">
            <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-surface2 text-[15px]">↧</div>
            <div className="flex-1">
              <div className="text-[13px] font-extrabold">Виплата #{p.id}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                {new Date(p.createdAt).toLocaleDateString("uk-UA")}
              </div>
            </div>
            <span className="text-sm font-extrabold">{p.netAmount.toLocaleString("uk-UA")} ₴</span>
            <span
              className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${
                p.status === "paid" ? "bg-success text-white" : "bg-accent2 text-[#111]"
              }`}
            >
              {p.status === "paid" ? "Зараховано" : "В обробці"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
