"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { useAdminStreams, streamStatusLabel, streamThumbnailUrl } from "@/lib/data/useAdminStreams";
import { ApiError } from "@/lib/api";

const statusColors: Record<string, string> = {
  live: "bg-danger text-white animate-pulse2",
  scheduled: "bg-accent2 text-[#111]",
  ended: "bg-surface2 text-muted",
};

export default function AdminLivePage() {
  const { streams, summary, loading, forceEnd } = useAdminStreams();
  const { showToast } = useAdminState();

  async function handleForceEnd(id: number) {
    try {
      await forceEnd(id);
      showToast("Ефір зупинено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося зупинити ефір");
    }
  }

  if (loading || !summary) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Зараз у ефірі</div>
          <div className="mt-1.5 text-2xl font-extrabold text-danger">{summary.activeNow}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Заплановано сьогодні</div>
          <div className="mt-1.5 text-2xl font-extrabold">{summary.scheduledToday}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Глядачів зараз</div>
          <div className="mt-1.5 text-2xl font-extrabold">{summary.currentViewers}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {streams.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <img
              src={streamThumbnailUrl(s, 100, 60)}
              alt={s.title}
              className="h-[54px] w-[90px] rounded-xl object-cover"
            />
            <div className="min-w-[200px] flex-[2]">
              <div className="text-[13.5px] font-extrabold">{s.title}</div>
              <div className="text-[11.5px] font-semibold text-muted">Продавець #{s.hostId}</div>
            </div>
            <div className="min-w-[90px] text-[12.5px] font-extrabold">
              {s.status === "live" ? `${s.currentViewers} глядачів` : "—"}
            </div>
            <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[s.status]}`}>
              {streamStatusLabel(s.status)}
            </span>
            {s.status === "live" && (
              <button
                onClick={() => handleForceEnd(s.id)}
                className="rounded-[10px] bg-danger px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
              >
                Зупинити ефір
              </button>
            )}
          </div>
        ))}
        {streams.length === 0 && (
          <div className="py-10 text-center text-[13px] font-semibold text-muted">Ще немає ефірів</div>
        )}
      </div>
    </div>
  );
}
