"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { imgUrl } from "@/lib/data/products";
import { adminLiveSummary } from "@/lib/data/admin";

const statusColors: Record<string, string> = {
  "У ефірі": "bg-danger text-white animate-pulse2",
  Заплановано: "bg-accent2 text-[#111]",
  Завершено: "bg-surface2 text-muted",
};

export default function AdminLivePage() {
  const { liveStreams, stopLiveStream } = useAdminState();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Зараз у ефірі</div>
          <div className="mt-1.5 text-2xl font-extrabold text-danger">{adminLiveSummary.activeNow}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Заплановано сьогодні</div>
          <div className="mt-1.5 text-2xl font-extrabold">{adminLiveSummary.scheduledToday}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Глядачів сьогодні</div>
          <div className="mt-1.5 text-2xl font-extrabold">{adminLiveSummary.totalViewersToday}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Замовлень з ефірів</div>
          <div className="mt-1.5 text-2xl font-extrabold text-success">{adminLiveSummary.ordersFromLive}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {liveStreams.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <img src={imgUrl(s.seed, 100, 60)} alt={s.title} className="h-[54px] w-[90px] rounded-xl object-cover" />
            <div className="min-w-[200px] flex-[2]">
              <div className="text-[13.5px] font-extrabold">{s.title}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                {s.seller} · {s.scheduled}
              </div>
            </div>
            <div className="min-w-[90px] text-[12.5px] font-extrabold">{s.viewers} глядачів</div>
            <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[s.status]}`}>
              {s.status}
            </span>
            {s.status === "У ефірі" && (
              <button
                onClick={() => stopLiveStream(s.id)}
                className="rounded-[10px] bg-danger px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
              >
                Зупинити ефір
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
