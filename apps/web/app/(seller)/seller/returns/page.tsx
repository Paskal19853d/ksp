"use client";

import { useSellerState } from "@/lib/store/SellerStateContext";
import { fmt, imgUrl } from "@/lib/data/seller";

const decisionColors: Record<string, string> = {
  "На розгляді": "bg-accent2 text-[#111]",
  Схвалено: "bg-success text-white",
  Відхилено: "bg-danger text-white",
};

export default function SellerReturnsPage() {
  const { orders, resolveReturn } = useSellerState();
  const returns = orders.filter((o) => o.status === "Повернення");

  if (returns.length === 0) {
    return (
      <div className="py-[70px] text-center text-muted">
        <div className="mb-3 text-[44px]">↩</div>
        <div className="text-base font-extrabold text-text">Немає активних повернень</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {returns.map((o) => (
        <div key={o.no} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
          <img src={imgUrl(o.seed, 92, 92)} alt={o.name} className="h-[54px] w-[54px] rounded-xl object-cover" />
          <div className="min-w-[170px] flex-[2]">
            <div className="text-[13.5px] font-extrabold">
              {o.no} · {fmt(o.sum)}
            </div>
            <div className="text-xs font-semibold text-muted">{o.name}</div>
            <div className="mt-1 text-xs font-semibold text-muted">
              {o.buyer} · {o.city} · {o.date}
            </div>
          </div>
          <div className="min-w-[200px] flex-[2]">
            <div className="text-[11px] font-extrabold text-muted">Причина повернення</div>
            <div className="text-[12.5px] font-bold">{o.returnReason}</div>
          </div>
          <span
            className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${decisionColors[o.returnDecision ?? "На розгляді"]}`}
          >
            {o.returnDecision}
          </span>
          {o.returnDecision === "На розгляді" && (
            <div className="flex gap-2">
              <button
                onClick={() => resolveReturn(o.no, "Схвалено")}
                className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
              >
                Схвалити
              </button>
              <button
                onClick={() => resolveReturn(o.no, "Відхилено")}
                className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
              >
                Відхилити
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
