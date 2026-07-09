"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/AppStateContext";
import { videos, products, imgUrl, avatarUrl, formatPrice, comments } from "@/lib/data/products";

export default function VideoPage() {
  const router = useRouter();
  const { addToCart, toggleFav, favs } = useAppState();
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [following, setFollowing] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const v = videos[idx];
  const product = products.find((p) => p.id === v.pid)!;
  const isLiked = !!liked[idx];
  const isFav = favs.includes(product.id);

  function next() {
    setIdx((i) => (i + 1) % videos.length);
    setCommentsOpen(false);
  }
  function prev() {
    setIdx((i) => (i - 1 + videos.length) % videos.length);
    setCommentsOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-[480px] overflow-hidden bg-black sm:h-[92vh] sm:rounded-card">
        <img src={imgUrl(v.seed, 800, 1400)} alt="відео" className="absolute inset-0 h-full w-full object-cover" />
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
          <div onClick={() => setLiked((l) => ({ ...l, [idx]: !l[idx] }))} className="flex cursor-pointer flex-col items-center gap-1">
            <span className="text-2xl" style={{ color: isLiked ? "#FF3B5C" : "#fff" }}>♥</span>
            <span className="text-[11px] font-extrabold text-white">
              {((v.likes + (isLiked ? 1 : 0)) / 1000).toFixed(1)}K
            </span>
          </div>
          <div onClick={() => setCommentsOpen(true)} className="flex cursor-pointer flex-col items-center gap-1">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/15 text-[19px] text-white backdrop-blur-sm">
              💬
            </span>
            <span className="text-[11px] font-extrabold text-white">{v.comments}</span>
          </div>
          <div className="flex cursor-pointer flex-col items-center gap-1">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white/15 text-[17px] text-white backdrop-blur-sm">
              ↗
            </span>
            <span className="text-[11px] font-extrabold text-white">Поділитись</span>
          </div>
          <div onClick={() => toggleFav(product.id)} className="flex cursor-pointer flex-col items-center gap-1">
            <span className="text-xl" style={{ color: isFav ? "var(--accent2)" : "#fff" }}>⚑</span>
            <span className="text-[11px] font-extrabold text-white">Зберегти</span>
          </div>
        </div>

        <div className="absolute bottom-4.5 left-3.5 right-[76px] text-white">
          <div className="flex items-center gap-2">
            <img src={avatarUrl(v.av)} alt={v.author} className="h-[38px] w-[38px] rounded-full border-2 border-white object-cover" />
            <span className="text-sm font-extrabold">{v.author}</span>
            <button
              onClick={() => setFollowing((f) => !f)}
              className="rounded-full border border-white/50 px-3 py-1 text-xs font-extrabold"
              style={{ background: following ? "transparent" : "#fff", color: following ? "#fff" : "#111" }}
            >
              {following ? "Відстежується" : "Підписатися"}
            </button>
          </div>
          <div className="mt-2 text-[13px] font-semibold leading-relaxed opacity-95">{v.caption}</div>
          <div className="mt-2.5 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-black/50 p-2.5 backdrop-blur-md">
            <img src={imgUrl(product.seed, 84, 84)} alt={product.name} className="h-[42px] w-[42px] rounded-xl object-cover" />
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
        </div>

        <div onClick={prev} className="absolute inset-y-20 left-0 w-1/3 cursor-pointer" />
        <div onClick={next} className="absolute inset-y-20 right-[70px] w-1/3 cursor-pointer" />

        {commentsOpen && (
          <>
            <div onClick={() => setCommentsOpen(false)} className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-x-0 bottom-0 flex max-h-[70%] flex-col rounded-t-[22px] bg-surface p-4.5 text-text">
              <div className="mx-auto mb-3.5 h-1 w-10 rounded bg-border" />
              <div className="mb-3.5 text-[15px] font-extrabold">Коментарі · {v.comments}</div>
              <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto">
                {comments.map((c) => (
                  <div key={c.name} className="flex gap-2.5">
                    <img src={avatarUrl(c.img)} alt={c.name} className="h-[34px] w-[34px] rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-extrabold text-muted">{c.name}</div>
                      <div className="mt-0.5 text-[13.5px] font-semibold leading-snug">{c.text}</div>
                      <div className="mt-1 text-[11px] font-semibold text-muted">{c.time} · Відповісти</div>
                    </div>
                    <span className="ml-auto text-xs font-bold text-muted">♥ {c.likes}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5 border-t border-border pt-3">
                <input
                  placeholder="Додати коментар…"
                  className="flex-1 rounded-full border border-border bg-surface2 px-4 py-2.5 text-[13px] font-semibold outline-none"
                />
                <button className="h-[42px] w-[42px] rounded-full bg-accent text-[15px] font-extrabold text-white">↑</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
