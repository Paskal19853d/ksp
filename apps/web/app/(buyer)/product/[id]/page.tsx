"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/lib/store/AppStateContext";
import { products, imgUrl, avatarUrl, formatPrice, reviewCards, shopByName } from "@/lib/data/products";

const colorNames = ["Чорний", "Білий", "Синій"];
const sizeNames = ["S", "M", "L", "XL"];

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, favs, toggleFav } = useAppState();
  const [thumbIdx, setThumbIdx] = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [selSize, setSelSize] = useState(1);

  const id = Number(params.id);
  const product = products.find((p) => p.id === id) ?? products[0];
  const isFav = favs.includes(product.id);
  const discount = product.old ? `−${Math.round((1 - product.price / product.old) * 100)}%` : "";

  const specs = [
    { k: "Бренд", v: product.seller },
    { k: "Категорія", v: product.cat },
    { k: "Гарантія", v: "12 місяців" },
    { k: "Країна", v: "Україна / імпорт" },
    { k: "Артикул", v: `TX-${1000 + product.id}` },
  ];

  const similar = products.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 4);
  const sellerShop = shopByName(product.seller);

  return (
    <div className="mx-auto max-w-[1060px] px-4 pb-[130px]">
      <div className="flex items-center gap-2.5 py-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
        >
          ←
        </button>
        <div className="text-[15px] font-extrabold">Товар</div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => toggleFav(product.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-[15px]"
            style={{ color: isFav ? "#FF3B5C" : "var(--muted)" }}
          >
            ♥
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-[13px]">
            ↗
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <img
            src={imgUrl(product.seed + (thumbIdx || ""), 800, 1000)}
            alt={product.name}
            className="block aspect-[4/5] w-full rounded-card object-cover shadow-card"
          />
          <div className="mt-2.5 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <img
                key={i}
                onClick={() => setThumbIdx(i)}
                src={imgUrl(product.seed + (i || ""), 200, 250)}
                alt="фото"
                className="h-[78px] w-16 cursor-pointer rounded-xl object-cover"
                style={{
                  border: thumbIdx === i ? "2px solid var(--accent)" : "2px solid transparent",
                  opacity: thumbIdx === i ? 1 : 0.65,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2.5 flex gap-2">
              {product.badge && (
                <span className="rounded-lg bg-accent2 px-2.5 py-1 text-[11px] font-extrabold text-[#111]">
                  {product.badge}
                </span>
              )}
              <span className="rounded-lg bg-surface2 px-2.5 py-1 text-[11px] font-bold text-muted">
                У наявності: {product.stock} шт
              </span>
            </div>
            <h1 className="m-0 text-2xl font-extrabold leading-snug">{product.name}</h1>
            <div className="mt-2 text-[13px] font-semibold text-muted">
              ★ {product.rating} · {product.reviews} відгуків · продано 1 200+
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-[30px] font-extrabold">{formatPrice(product.price)}</span>
              {product.old > 0 && (
                <>
                  <span className="text-base text-muted line-through">{formatPrice(product.old)}</span>
                  <span className="rounded-lg bg-danger px-2 py-1 text-xs font-extrabold text-white">{discount}</span>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[13px] font-extrabold">Колір</div>
            <div className="flex gap-2">
              {colorNames.map((c, i) => (
                <span
                  key={c}
                  onClick={() => setSelColor(i)}
                  className="cursor-pointer rounded-xl border-[1.5px] px-4 py-2.5 text-[13px] font-bold"
                  style={{
                    borderColor: selColor === i ? "var(--accent)" : "var(--border)",
                    background: selColor === i ? "var(--accent)" : "var(--surface)",
                    color: selColor === i ? "#fff" : "var(--text)",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[13px] font-extrabold">Розмір / варіант</div>
            <div className="flex flex-wrap gap-2">
              {sizeNames.map((z, i) => (
                <span
                  key={z}
                  onClick={() => setSelSize(i)}
                  className="cursor-pointer rounded-xl border-[1.5px] px-4 py-2.5 text-[13px] font-bold"
                  style={{
                    borderColor: selSize === i ? "var(--accent)" : "var(--border)",
                    background: selSize === i ? "var(--accent)" : "var(--surface)",
                    color: selSize === i ? "#fff" : "var(--text)",
                  }}
                >
                  {z}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => addToCart(product.id)}
              className="flex-1 rounded-2xl border border-border bg-surface2 py-3.5 text-[15px] font-extrabold hover:border-accent"
            >
              У кошик
            </button>
            <button
              onClick={() => {
                addToCart(product.id);
                router.push("/cart");
              }}
              className="flex-1 rounded-2xl bg-accent py-3.5 text-[15px] font-extrabold text-white hover:brightness-110"
            >
              Купити зараз
            </button>
          </div>

          <Link
            href={`/shop/${sellerShop.id}`}
            className="flex cursor-pointer items-center gap-3 rounded-card border border-border bg-surface p-3.5 hover:border-accent"
          >
            <img src={avatarUrl(sellerShop.av)} alt={product.seller} className="h-[46px] w-[46px] rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-sm font-extrabold">
                {product.seller} <span className="text-xs text-accent">✓</span>
              </div>
              <div className="text-xs font-semibold text-muted">★ 4.9 · {sellerShop.followers} підписників · Перевірений продавець</div>
            </div>
            <span className="text-[13px] font-extrabold text-accent">До магазину →</span>
          </Link>

          <div className="rounded-card border border-border bg-surface p-4">
            <div className="mb-2.5 text-sm font-extrabold">Доставка та гарантія</div>
            <div className="flex flex-col gap-2 text-[13px] font-semibold text-muted">
              <span>Нова пошта — завтра, від 60 ₴ (безкоштовно від 1 500 ₴)</span>
              <span>Повернення протягом 14 днів без пояснення причин</span>
              <span>Офіційна гарантія 12 місяців</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-7 text-[18px] font-extrabold">Характеристики</h2>
      <div className="rounded-card border border-border bg-surface px-4.5">
        {specs.map((sp) => (
          <div key={sp.k} className="flex justify-between gap-5 border-b border-border py-2.5 text-[13px] last:border-0">
            <span className="font-semibold text-muted">{sp.k}</span>
            <span className="text-right font-bold">{sp.v}</span>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-7 text-[18px] font-extrabold">Відгуки · {product.reviews}</h2>
      <div className="flex flex-col gap-2.5">
        {reviewCards.map((r) => (
          <div key={r.name} className="rounded-card border border-border bg-surface p-4">
            <div className="flex items-center gap-2.5">
              <img src={avatarUrl(r.img)} alt={r.name} className="h-9 w-9 rounded-full object-cover" />
              <div className="flex-1">
                <div className="text-[13px] font-extrabold">{r.name}</div>
                <div className="text-[11px] font-semibold text-muted">{r.date}</div>
              </div>
              <span className="text-[13px] font-extrabold text-accent2">{r.stars}</span>
            </div>
            <div className="mt-2.5 text-[13.5px] leading-relaxed">{r.text}</div>
          </div>
        ))}
      </div>

      {similar.length > 0 && (
        <>
          <h2 className="mb-3 mt-7 text-[18px] font-extrabold">Схожі товари</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {similar.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="flex-none cursor-pointer overflow-hidden rounded-card border border-border bg-surface hover:-translate-y-1"
                style={{ width: 160 }}
              >
                <img src={imgUrl(p.seed, 300, 300)} alt={p.name} className="block aspect-square w-full object-cover" />
                <div className="p-3">
                  <div className="text-xs font-bold leading-snug">{p.name}</div>
                  <div className="mt-1.5 text-sm font-extrabold">{formatPrice(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
