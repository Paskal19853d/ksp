"use client";

import { useMyVideos, videoThumbnailUrl } from "@/lib/data/useVideos";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function BloggerVideosPage() {
  const { videos, loading } = useMyVideos();

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  if (videos.length === 0) return <ComingSoon title="Ви ще не завантажили жодного відео" />;

  return (
    <div className="flex flex-col gap-2.5">
      {videos.map((v) => (
        <div key={v.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
          <img
            src={videoThumbnailUrl(v, 90, 130)}
            alt={v.caption || "відео"}
            className="h-[70px] w-[48px] rounded-xl object-cover"
          />
          <div className="min-w-[200px] flex-[2]">
            <div className="text-[13px] font-semibold leading-snug">{v.caption}</div>
            {v.status === "hidden" && (
              <div className="mt-1 text-[11px] font-extrabold text-danger">Приховано модерацією</div>
            )}
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 text-[11.5px] font-bold text-muted sm:grid-cols-3">
            <span>{v.viewsCount.toLocaleString("uk-UA")} переглядів</span>
            <span>{v.likesCount.toLocaleString("uk-UA")} лайків</span>
            <span>{v.commentsCount} коментарів</span>
          </div>
        </div>
      ))}
    </div>
  );
}
