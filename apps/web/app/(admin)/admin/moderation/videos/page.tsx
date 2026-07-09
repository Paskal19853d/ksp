"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { imgUrl } from "@/lib/data/products";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function AdminModerationVideosPage() {
  const { videos, resolveVideo } = useAdminState();
  const pending = videos.filter((v) => v.status === "На розгляді");

  if (pending.length === 0) return <ComingSoon title="Немає відео на розгляді" />;

  return (
    <div className="flex flex-col gap-2.5">
      {pending.map((v) => (
        <div key={v.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
          <img src={imgUrl(v.seed, 90, 130)} alt={v.caption} className="h-[70px] w-[48px] rounded-xl object-cover" />
          <div className="min-w-[200px] flex-[2]">
            <div className="text-[13.5px] font-extrabold">{v.author}</div>
            <div className="mt-0.5 text-[12.5px] font-semibold text-muted">{v.caption}</div>
            <div className="mt-1 text-[11.5px] font-bold text-danger">{v.reason}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => resolveVideo(v.id, "Схвалено")}
              className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
            >
              Схвалити
            </button>
            <button
              onClick={() => resolveVideo(v.id, "Відхилено")}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
            >
              Видалити
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
