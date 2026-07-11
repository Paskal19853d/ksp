"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { useAppState } from "@/lib/store/AppStateContext";
import { stories, categories, imgUrl, avatarUrl } from "@/lib/data/products";
import { useProducts, toCardData } from "@/lib/data/useProducts";
import { useLiveStreams } from "@/lib/data/useLiveStream";

export default function FeedPage() {
  const router = useRouter();
  const { addToCart, favs, toggleFav } = useAppState();
  const [activeCat, setActiveCat] = useState("Все");

  const { products } = useProducts({ limit: 60 });
  const { streams: liveStreams } = useLiveStreams();
  const filtered = activeCat === "Все" ? products : products.filter((p) => p.category?.name === activeCat);

  return (
    <div className="mx-auto max-w-[1120px] px-4 pb-[100px]">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-bg py-4">
        <div className="font-display text-base font-extrabold lg:hidden">TREETEX</div>
        <Link
          href="/search"
          className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-full border border-border bg-surface px-4.5 py-2.5 text-sm font-semibold text-muted hover:border-accent"
        >
          ⌕ Пошук товарів, магазинів, відео…
        </Link>
        <Link
          href="/notifs"
          className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border bg-surface text-[15px] hover:border-accent"
        >
          🔔
          <span className="absolute -right-0.5 -top-0.5 rounded-full bg-danger px-1.5 py-px text-[9px] font-extrabold text-white">
            3
          </span>
        </Link>
        <Link
          href="/chat"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border bg-surface text-[15px] hover:border-accent"
        >
          💬
        </Link>
      </div>

      <div className="relative -mx-4">
        <div className="flex gap-3.5 overflow-x-auto px-4 pb-3.5 pt-1.5 no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%_-_28px),transparent)]">
          {stories.map(([name, av]) => (
            <div key={name} className="flex flex-none flex-col items-center gap-1.5">
              <div className="h-[62px] w-[62px] rounded-full bg-gradient-to-br from-accent to-accent2 p-[3px]">
                <img
                  src={avatarUrl(av)}
                  alt={name}
                  className="block h-full w-full rounded-full border-[3px] border-bg object-cover"
                />
              </div>
              <span className="max-w-16 truncate text-[11px] font-semibold text-muted">{name}</span>
            </div>
          ))}
          <span className="flex-none px-1" aria-hidden />
        </div>
      </div>

      {liveStreams.length > 0 && (
        <>
          <div className="mb-3 mt-2 flex items-center justify-between">
            <h2 className="m-0 text-[19px] font-extrabold">Зараз у ефірі</h2>
            <Link href="/live" className="cursor-pointer text-[13px] font-bold text-accent">
              Усі ефіри →
            </Link>
          </div>
          <div className="relative -mx-4">
            <div className="flex gap-3.5 overflow-x-auto px-4 pb-2 no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%_-_28px),transparent)]">
              {liveStreams.map((lv) => (
                <div
                  key={lv.id}
                  onClick={() => router.push(`/live?id=${lv.id}`)}
                  className="relative flex-none cursor-pointer overflow-hidden rounded-card shadow-card hover:-translate-y-1"
                  style={{ width: 210 }}
                >
                  <img src={imgUrl("livebeauty", 420, 560)} alt={lv.title} className="block h-[280px] w-[210px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/75" />
                  <div className="absolute left-2.5 top-2.5 flex gap-1.5">
                    <span className="animate-pulse2 rounded-lg bg-danger px-2 py-1 text-[11px] font-extrabold text-white">
                      LIVE
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[13px] font-extrabold leading-tight">{lv.title}</div>
                  </div>
                </div>
              ))}
              <span className="flex-none px-1" aria-hidden />
            </div>
          </div>
        </>
      )}

      <div className="relative -mx-4">
        <div className="flex gap-2 overflow-x-auto px-4 pb-1.5 pt-4 no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%_-_28px),transparent)]">
          {categories.map((c) => (
            <span
              key={c}
              onClick={() => setActiveCat(c)}
              className={`flex-none cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-bold hover:border-accent ${
                activeCat === c ? "border-accent bg-accent text-white" : "border-border bg-surface text-text"
              }`}
            >
              {c}
            </span>
          ))}
          <span className="flex-none px-1" aria-hidden />
        </div>
      </div>

      <div className="mb-3 mt-3.5 flex items-center justify-between">
        <h2 className="m-0 text-[19px] font-extrabold">Рекомендовано для вас</h2>
        <Link href="/search" className="cursor-pointer text-[13px] font-bold text-accent">
          Каталог →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <div key={p.id} className="relative">
            <div onClick={() => router.push(`/product/${p.id}`)}>
              <ProductCard product={toCardData(p)} onAddToCart={(id) => addToCart(id)} />
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleFav(p.id);
              }}
              className="absolute right-2.5 top-2.5 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-black/40 text-[15px] backdrop-blur-sm"
              style={{ color: favs.includes(p.id) ? "#FF3B5C" : "#fff" }}
            >
              ♥
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
