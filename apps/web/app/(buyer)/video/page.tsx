"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/data/products";
import { productImgUrl } from "@/lib/data/useProducts";
import {
  useVideoFeed,
  useVideoComments,
  videoThumbnailUrl,
  toggleVideoLike,
  registerVideoView,
} from "@/lib/data/useVideos";
import { useAppState } from "@/lib/store/AppStateContext";

export default function VideoPage() {
  const router = useRouter();
  const { addToCart, toggleFav, favs } = useAppState();
  const { videos, loading } = useVideoFeed({ limit: 20 });
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [following, setFollowing] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const v = videos[idx];
  const product = v?.product;
  const isLiked = v ? !!liked[v.id] : false;
  const isFav = product ? favs.includes(product.id) : false;
  const { comments, addComment } = useVideoComments(v?.id ?? null);

  useEffect(() => {
    if (v) registerVideoView(v.id).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v?.id]);

  if (loading) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">Завантаження…</div>;
  }

  if (!v) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black text-white">
        <span>Поки що немає відео</span>
        <button onClick={() => router.push("/feed")} className="rounded-full bg-white/15 px-4 py-2 text-sm font-extrabold">
          На головну
        </button>
      </div>
    );
  }

  async function toggleLike() {
    const { liked: nowLiked } = await toggleVideoLike(v.id);
    setLiked((l) => ({ ...l, [v.id]: nowLiked }));
    setLikeCounts((c) => ({ ...c, [v.id]: (c[v.id] ?? v.likesCount) + (nowLiked ? 1 : -1) }));
  }

  async function submitComment() {
    const text = commentText.trim();
    if (!text) return;
    await addComment(text);
    setCommentText("");
  }

  function next() {
    setIdx((i) => (i + 1) % videos.length);
    setCommentsOpen(false);
  }
  function prev() {
    setIdx((i) => (i - 1 + videos.length) % videos.length);
    setCommentsOpen(false);
  }

  const likesCount = likeCounts[v.id] ?? v.likesCount;
  const commentsCount = comments.length || v.commentsCount;

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-[480px] overflow-hidden bg-black sm:h-[92vh] sm:rounded-card">
        <img
          src={videoThumbnailUrl(v, 800, 1400)}
          alt="відео"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 from-0% via-transparent via-55% to-black/80" />

        <div className="absolute inset-x-0 top-0 flex items-center gap-2.5 p-4">
          <button
            onClick={() => router.push("/feed")}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm"
          >
            ←
          </button>
          <span className="text-sm font-extrabold text-white">Для вас</span>
          <span className="text-sm font-bold text-white/55">Підписки</span>
        </div>

        <div className="absolute bottom-[120px] right-2.5 flex flex-col items-center gap-4.5">
          <div onClick={toggleLike} className="flex cursor-pointer flex-col items-center gap-1">
            <span className="text-2xl" style={{ color: isLiked ? "#FF3B5C" : "#fff" }}>♥</span>
            <span className="text-[11px] font-extrabold text-white">{likesCount}</span>
          </div>
          <div onClick={() => setCommentsOpen(true)} className="flex cursor-pointer flex-col items-center gap-1">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/15 text-[19px] text-white backdrop-blur-sm">
              💬
            </span>
            <span className="text-[11px] font-extrabold text-white">{commentsCount}</span>
          </div>
          <div className="flex cursor-pointer flex-col items-center gap-1">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/15 text-[17px] text-white backdrop-blur-sm">
              ↗
            </span>
            <span className="text-[11px] font-extrabold text-white">Поділитись</span>
          </div>
          {product && (
            <div onClick={() => toggleFav(product.id)} className="flex cursor-pointer flex-col items-center gap-1">
              <span className="text-xl" style={{ color: isFav ? "var(--accent2)" : "#fff" }}>⚑</span>
              <span className="text-[11px] font-extrabold text-white">Зберегти</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-4.5 left-3.5 right-[76px] text-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold">Автор #{v.authorId}</span>
            <button
              onClick={() => setFollowing((f) => !f)}
              className="rounded-full border border-white/50 px-3 py-1 text-xs font-extrabold"
              style={{ background: following ? "transparent" : "#fff", color: following ? "#fff" : "#111" }}
            >
              {following ? "Відстежується" : "Підписатися"}
            </button>
          </div>
          {v.caption && <div className="mt-2 text-[13px] font-semibold leading-relaxed opacity-95">{v.caption}</div>}
          {product && (
            <div className="mt-2.5 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-black/50 p-2.5 backdrop-blur-md">
              <img src={productImgUrl(product, 84, 84)} alt={product.name} className="h-[42px] w-[42px] rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold">{product.name}</div>
                <div className="text-sm font-extrabold text-accent2">{formatPrice(product.price)}</div>
              </div>
              <button
                onClick={() => addToCart(product.id)}
                className="flex-none rounded-[10px] bg-accent px-3.5 py-2.5 text-xs font-extrabold text-white hover:brightness-110"
              >
                Купити
              </button>
            </div>
          )}
        </div>

        <div onClick={prev} className="absolute inset-y-20 left-0 w-1/3 cursor-pointer" />
        <div onClick={next} className="absolute inset-y-20 right-[70px] w-1/3 cursor-pointer" />

        {commentsOpen && (
          <>
            <div onClick={() => setCommentsOpen(false)} className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-x-0 bottom-0 flex max-h-[70%] flex-col rounded-t-[22px] bg-surface p-4.5 text-text">
              <div className="mx-auto mb-3.5 h-1 w-10 rounded bg-border" />
              <div className="mb-3.5 text-[15px] font-extrabold">Коментарі · {commentsCount}</div>
              <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-surface2 text-xs font-extrabold text-muted">
                      #{c.authorId}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-muted">Користувач #{c.authorId}</div>
                      <div className="mt-0.5 text-[13.5px] font-semibold leading-snug">{c.text}</div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-center text-[13px] font-semibold text-muted">Ще немає коментарів</div>
                )}
              </div>
              <div className="flex gap-2.5 border-t border-border pt-3">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitComment()}
                  placeholder="Додати коментар…"
                  className="flex-1 rounded-full border border-border bg-surface2 px-4 py-2.5 text-[13px] font-semibold outline-none"
                />
                <button
                  onClick={submitComment}
                  className="h-[42px] w-[42px] rounded-full bg-accent text-[15px] font-extrabold text-white"
                >
                  ↑
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
