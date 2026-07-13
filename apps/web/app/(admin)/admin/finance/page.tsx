"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { usePlatformFinanceSummary, useAllPayouts } from "@/lib/data/useFinance";
import { ApiError } from "@/lib/api";

const statusLabels: Record<string, string> = {
  pending: "В обробці",
  paid: "Виплачено",
};

const statusColors: Record<string, string> = {
  paid: "bg-success text-white",
  pending: "bg-accent2 text-[#111]",
};

export default function AdminFinancePage() {
  const { summary, loading: summaryLoading } = usePlatformFinanceSummary();
  const { payouts, loading: payoutsLoading, markPaid } = useAllPayouts();
  const { showToast } = useAdminState();

  async function handleMarkPaid(id: number) {
    try {
      await markPaid(id);
      showToast("Виплату позначено як виконану");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося оновити виплату");
    }
  }

  if (summaryLoading || payoutsLoading || !summary) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">GMV платформи</div>
          <div className="mt-1.5 text-2xl font-extrabold">{summary.gmv.toLocaleString("uk-UA")} ₴</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Дохід платформи</div>
          <div className="mt-1.5 text-2xl font-extrabold text-success">
            {summary.platformRevenue.toLocaleString("uk-UA")} ₴
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Очікують виплати</div>
          <div className="mt-1.5 text-2xl font-extrabold text-accent2">
            {summary.pendingPayouts.toLocaleString("uk-UA")} ₴
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-2.5 text-[15px] font-extrabold">Виплати продавцям</h2>
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <div className="flex bg-surface2 px-4.5 py-3 text-[11px] font-extrabold tracking-wider text-muted">
            <span className="flex-[2]">ПРОДАВЕЦЬ</span>
            <span className="flex-1">ДАТА</span>
            <span className="flex-1">СУМА</span>
            <span className="flex-1">КОМІСІЯ</span>
            <span className="flex-1">СТАТУС</span>
            <span className="flex-1" />
          </div>
          {payouts.length === 0 && (
            <div className="p-6 text-center text-[13px] font-semibold text-muted">Виплат ще немає</div>
          )}
          {payouts.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center border-t border-border px-4.5 py-3.5 text-[13px] font-bold">
              <span className="flex-[2]">{p.seller?.name}</span>
              <span className="flex-1 text-muted">{new Date(p.createdAt).toLocaleDateString("uk-UA")}</span>
              <span className="flex-1">{p.gmv.toLocaleString("uk-UA")} ₴</span>
              <span className="flex-1 text-muted">{p.commission.toLocaleString("uk-UA")} ₴</span>
              <span className="flex-1">
                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[p.status]}`}>
                  {statusLabels[p.status]}
                </span>
              </span>
              <span className="flex-1 text-right">
                {p.status === "pending" && (
                  <button
                    onClick={() => handleMarkPaid(p.id)}
                    className="rounded-[10px] border border-border bg-surface2 px-3 py-1.5 text-[11px] font-extrabold hover:border-accent"
                  >
                    Позначити виплаченим
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
