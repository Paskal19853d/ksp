"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { shops, imgUrl, avatarUrl, formatPrice } from "@/lib/data/products";
import { useProducts, productImgUrl } from "@/lib/data/useProducts";

const shopTabs = ["Товари", "Відгуки", "Акції", "Про магазин"];

export default function ShopPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState(0);
  const [following, setFollowing] = useState(false);

  const shopId = parseInt(params.id, 10);
  const shop = shops.find((s) => s.id === shopId) ?? shops[0];
  const shopCover = imgUrl("shopcoverbig" + shop.id, 1200, 300);
  const shopLogo = avatarUrl(shop.av);
  const { products } = useProducts({ limit: 100 });
  const shopProducts = products.filter((p) => p.seller?.name === shop.name);

  return (
    <div className="mx-auto max-w-[1060px] pb-[110px]">
      <div className="relative">
        <img src={shopCover} alt="обкладинка" className="block h-[190px] w-full object-cover" />
        <button
          onClick={() => router.back()}
          className="absolute left-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
        >
          ←
        </button>
      </div>
      <div className="px-4.5">
        <div className="-mt-8.5 flex items-end gap-3.5">
          <img
            src={shopLogo}
            alt={shop.name}
            className="h-[84px] w-[84px] rounded-[24px] border-4 border-bg object-cover"
          />
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 text-xl font-extrabold">
              {shop.name} <span className="text-sm text-accent">✓</span>
            </div>
            <div className="text-[12.5px] font-semibold text-muted">
              ★ 4.9 · {shop.followers} підписників · {shopProducts.length} товарів
            </div>
          </div>
        </div>
        <div className="mt-3 text-[13.5px] font-semibold leading-relaxed text-muted">{shop.desc}</div>
        <div className="mt-3.5 flex gap-2.5">
          <button
            onClick={() => setFollowing((f) => !f)}
            className="flex-1 rounded-xl py-3 text-[13.5px] font-extrabold"
            style={
              following
                ? { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }
                : { background: "var(--accent)", color: "#fff", border: "none" }
            }
          >
            {following ? "Відстежується" : "Підписатися"}
          </button>
          <Link
            href="/chat"
            className="flex-1 rounded-xl border border-border bg-surface2 py-3 text-center text-[13.5px] font-extrabold hover:border-accent"
          >
            Написати
          </Link>
          <Link
            href="/live"
            className="flex-1 rounded-xl bg-danger py-3 text-center text-[13.5px] font-extrabold text-white hover:brightness-110"
          >
            ● Ефір
          </Link>
        </div>
        <div className="mt-5 flex gap-2 border-b border-border">
          {shopTabs.map((t, i) => (
            <span
              key={t}
              onClick={() => setTab(i)}
              className="cursor-pointer px-4 py-2.5 text-[13.5px] font-extrabold"
              style={{
                color: tab === i ? "var(--text)" : "var(--muted)",
                borderBottom: tab === i ? "2.5px solid var(--accent)" : "2.5px solid transparent",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        {tab === 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {shopProducts.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="cursor-pointer overflow-hidden rounded-card border border-border bg-surface hover:-translate-y-1 hover:shadow-card"
              >
                <img src={productImgUrl(p, 480, 600)} alt={p.name} className="block aspect-[4/5] w-full object-cover" />
                <div className="p-3.5">
                  <div className="text-[13px] font-bold leading-snug">{p.name}</div>
                  <div className="mt-1.5 text-[15px] font-extrabold">{formatPrice(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {tab !== 0 && (
          <div className="py-10 text-center text-[13px] font-semibold text-muted">Розділ у розробці</div>
        )}
      </div>
    </div>
  );
}
