"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function AdminModerationCommentsPage() {
  const { comments, resolveComment } = useAdminState();
  const pending = comments.filter((c) => c.status === "На розгляді");

  if (pending.length === 0) return <ComingSoon title="Немає коментарів на розгляді" />;

  return (
    <div className="flex flex-col gap-2.5">
      {pending.map((c) => (
        <div key={c.id} className="rounded-card border border-border bg-surface p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-extrabold">{c.author}</span>
            <span className="text-[11.5px] font-semibold text-muted">{c.context}</span>
          </div>
          <div className="mt-2 rounded-xl bg-surface2 p-3.5 text-[13px] font-semibold">{c.text}</div>
          <div className="mt-2 text-[11.5px] font-bold text-danger">{c.reason}</div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => resolveComment(c.id, "Схвалено")}
              className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
            >
              Залишити
            </button>
            <button
              onClick={() => resolveComment(c.id, "Відхилено")}
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
