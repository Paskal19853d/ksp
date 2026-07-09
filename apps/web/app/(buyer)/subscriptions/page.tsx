"use client";

import { useState } from "react";
import Link from "next/link";
import { stories, avatarUrl, shops } from "@/lib/data/products";

export default function SubscriptionsPage() {
  const [unfollowed, setUnfollowed] = useState<string[]>([]);

  const list = stories.filter(([name]) => !unfollowed.includes(name));

  function unfollow(name: string) {
    setUnfollowed((cur) => [...cur, name]);
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 pb-[120px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Підписки</h1>
        <span className="text-sm font-bold text-muted">{list.length ? `${list.length}` : ""}</span>
      </div>

      {list.length === 0 ? (
        <div className="py-[70px] text-center text-muted">
          <div className="mb-3 text-[44px]">☆</div>
          <div className="text-base font-extrabold text-text">Немає підписок</div>
          <div className="mt-1.5 text-[13px] font-semibold">Підписуйтесь на магазини та блогерів у їхніх профілях</div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          {list.map(([name, av]) => {
            const shop = shops.find((s) => s.name === name);
            const info = (
              <div className="flex flex-1 items-center gap-3">
                <img src={avatarUrl(av)} alt={name} className="h-11 w-11 rounded-2xl object-cover" />
                <div className="flex items-center gap-1 text-[13.5px] font-extrabold">
                  {name} <span className="text-[11px] text-accent">✓</span>
                </div>
              </div>
            );
            return (
              <div
                key={name}
                className="flex items-center gap-3 border-b border-border p-3.5 last:border-0 hover:bg-surface2"
              >
                {shop ? <Link href={`/shop/${shop.id}`} className="flex flex-1">{info}</Link> : info}
                <button
                  onClick={() => unfollow(name)}
                  className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-[11.5px] font-extrabold hover:border-danger hover:text-danger"
                >
                  Відписатися
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
