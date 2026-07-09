"use client";

import { useState } from "react";
import { useSellerState } from "@/lib/store/SellerStateContext";
import { avatarUrl } from "@/lib/data/seller";

export default function SellerReviewsPage() {
  const { reviews, replyToReview } = useSellerState();
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const avgStars = reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;

  function submitReply(id: number) {
    replyToReview(id, drafts[id] ?? "");
    setDrafts((d) => ({ ...d, [id]: "" }));
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">Середня оцінка</div>
          <div className="mt-1 text-2xl font-extrabold text-accent2">★ {avgStars.toFixed(1)}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">Всього відгуків</div>
          <div className="mt-1 text-2xl font-extrabold">{reviews.length}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">Без відповіді</div>
          <div className="mt-1 text-2xl font-extrabold text-danger">
            {reviews.filter((r) => !r.reply).length}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-card border border-border bg-surface p-4.5">
            <div className="flex items-center gap-3">
              <img src={avatarUrl(r.av)} alt={r.author} className="h-10 w-10 rounded-2xl object-cover" />
              <div className="flex-1">
                <div className="text-[13px] font-extrabold">{r.author}</div>
                <div className="text-[11px] font-semibold text-muted">{r.product} · {r.date}</div>
              </div>
              <span className="text-sm font-extrabold text-accent2">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
            </div>
            <div className="mt-2.5 text-[13px] font-semibold leading-relaxed">{r.text}</div>

            {r.reply ? (
              <div className="mt-3 rounded-xl bg-surface2 p-3.5">
                <div className="text-[11px] font-extrabold text-accent">Ваша відповідь</div>
                <div className="mt-1 text-[12.5px] font-semibold">{r.reply}</div>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <input
                  value={drafts[r.id] ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                  placeholder="Написати відповідь покупцю…"
                  className="flex-1 rounded-[10px] border border-border bg-bg px-3.5 py-2.5 text-[12.5px] font-semibold outline-none"
                />
                <button
                  onClick={() => submitReply(r.id)}
                  className="rounded-[10px] bg-accent px-4 text-[12.5px] font-extrabold text-white hover:brightness-110"
                >
                  Надіслати
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
