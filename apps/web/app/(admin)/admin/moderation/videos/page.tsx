"use client";

import type { Report } from "@treetex/shared";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { usePendingReports } from "@/lib/data/useReports";
import { useVideo, videoThumbnailUrl } from "@/lib/data/useVideos";
import { ComingSoon } from "@/components/admin/ComingSoon";
import { ApiError } from "@/lib/api";

function VideoReportRow({ report, onResolve }: { report: Report; onResolve: (status: "approved" | "rejected") => void }) {
  const { video } = useVideo(report.targetId);

  if (!video) return null;

  return (
    <div className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
      <img
        src={videoThumbnailUrl(video, 90, 130)}
        alt={video.caption || "відео"}
        className="h-[70px] w-[48px] rounded-xl object-cover"
      />
      <div className="min-w-[200px] flex-[2]">
        <div className="text-[13.5px] font-extrabold">Автор #{video.authorId}</div>
        <div className="mt-0.5 text-[12.5px] font-semibold text-muted">{video.caption}</div>
        <div className="mt-1 text-[11.5px] font-bold text-danger">{report.reason}</div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onResolve("rejected")}
          className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
        >
          Відхилити скаргу
        </button>
        <button
          onClick={() => onResolve("approved")}
          className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
        >
          Приховати відео
        </button>
      </div>
    </div>
  );
}

export default function AdminModerationVideosPage() {
  const { reports, loading, resolve } = usePendingReports();
  const { showToast } = useAdminState();
  const videoReports = reports.filter((r) => r.targetType === "video");

  async function handleResolve(id: number, status: "approved" | "rejected") {
    try {
      await resolve(id, status);
      showToast(status === "approved" ? "Відео приховано" : "Скаргу відхилено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося обробити скаргу");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  if (videoReports.length === 0) return <ComingSoon title="Немає відео на розгляді" />;

  return (
    <div className="flex flex-col gap-2.5">
      {videoReports.map((r) => (
        <VideoReportRow key={r.id} report={r} onResolve={(status) => handleResolve(r.id, status)} />
      ))}
    </div>
  );
}
