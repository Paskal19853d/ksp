"use client";

import { useBloggerState } from "@/lib/store/BloggerStateContext";
import { useBloggerBalance, useBloggerPayouts } from "@/lib/data/useBlogger";
import { ApiError } from "@/lib/api";

export default function BloggerPayoutsPage() {
  const { showToast } = useBloggerState();
  const { balance, loading: balanceLoading } = useBloggerBalance();
  const { payouts, loading: payoutsLoading, requestPayout } = useBloggerPayouts();

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

  const totalEarned = balance.available + payouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="rounded-card bg-accent p-4.5 text-white">
          <div className="text-xs font-bold opacity-80">Доступно до виплати</div>
          <div className="mt-1.5 text-2xl font-extrabold">{balance.available.toLocaleString("uk-UA")} ₴</div>
          <button
            onClick={handleRequestPayout}
            disabled={balance.available <= 0}
            className="mt-3 rounded-lg bg-white/20 px-3.5 py-2 text-xs font-extrabold hover:bg-white/30 disabled:opacity-40"
          >
            Вивести кошти
          </button>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Всього зароблено</div>
          <div className="mt-1.5 text-2xl font-extrabold">{totalEarned.toLocaleString("uk-UA")} ₴</div>
        </div>
      </div>

      <div>
        <h2 className="mb-2.5 text-[15px] font-extrabold">Історія виплат</h2>
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          {payouts.length === 0 && (
            <div className="p-6 text-center text-[13px] font-semibold text-muted">Виплат ще не було</div>
          )}
          {payouts.map((p) => (
            <div key={p.id} className="flex items-center justify-between border-b border-border px-4.5 py-3.5 last:border-0">
              <div>
                <div className="text-[13px] font-extrabold">Виплата #{p.id}</div>
                <div className="text-[11.5px] font-semibold text-muted">
                  {new Date(p.createdAt).toLocaleDateString("uk-UA")}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[13.5px] font-extrabold text-success">{p.amount.toLocaleString("uk-UA")} ₴</span>
                <span
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${
                    p.status === "paid" ? "bg-success text-white" : "bg-accent2 text-[#111]"
                  }`}
                >
                  {p.status === "paid" ? "Зараховано" : "В обробці"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
