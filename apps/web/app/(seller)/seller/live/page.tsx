"use client";

import { useSellerState } from "@/lib/store/SellerStateContext";
import { liveKpis, liveHistory, imgUrl } from "@/lib/data/seller";

export default function SellerLivePage() {
  const { showToast } = useSellerState();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {liveKpis.map((k) => (
          <div key={k.label} className="rounded-card border border-border bg-surface p-4.5">
            <div className="text-xs font-bold text-muted">{k.label}</div>
            <div className="mt-1.5 text-2xl font-extrabold">{k.value}</div>
            <div className="mt-1.5 text-[11.5px] font-extrabold" style={{ color: k.up ? "var(--success)" : "var(--danger)" }}>
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-card bg-gradient-to-br from-danger to-[#B00030] p-5.5 text-white">
        <div className="min-w-[220px] flex-1">
          <div className="text-[11px] font-extrabold tracking-wider opacity-80">ЗАПЛАНОВАНИЙ ЕФІР · СЬОГОДНІ 19:00</div>
          <div className="mt-1.5 text-[19px] font-extrabold">Гаджети тижня: тестуємо новинки наживо</div>
          <div className="mt-1 text-[12.5px] font-semibold opacity-85">
            6 товарів у добірці · знижка ефіру −30% · нагадування у 12 400 підписників
          </div>
        </div>
        <button
          onClick={() => showToast("Ефір розпочато — глядачі отримали сповіщення")}
          className="rounded-2xl bg-white px-6.5 py-3.5 text-sm font-extrabold text-[#B00030] hover:brightness-95"
        >
          ● Почати ефір
        </button>
      </div>

      <div className="rounded-card border border-border bg-surface p-5">
        <div className="mb-3 text-[15px] font-extrabold">Історія ефірів</div>
        {liveHistory.map((h) => (
          <div key={h.title} className="flex flex-wrap items-center gap-3.5 border-t border-border py-3">
            <img src={imgUrl(h.seed, 112, 84)} alt="ефір" className="h-[42px] w-14 rounded-[9px] object-cover" />
            <div className="min-w-[170px] flex-[2]">
              <div className="text-[13px] font-extrabold">{h.title}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                {h.date} · {h.dur}
              </div>
            </div>
            <div className="min-w-[100px] flex-1 text-[12.5px] font-bold text-muted">{h.viewers} глядачів</div>
            <div className="min-w-[90px] flex-1 text-[12.5px] font-bold text-muted">{h.orders} замовлень</div>
            <span className="text-sm font-extrabold text-success">{h.income}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
