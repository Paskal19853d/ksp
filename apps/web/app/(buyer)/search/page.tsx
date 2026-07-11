"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/data/products";
import { useProducts, productImgUrl } from "@/lib/data/useProducts";

const filterDefs = ["Знижки", "★ 4.8+", "До 2 000 ₴", "У наявності"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { products } = useProducts({ search: query || undefined, limit: 60 });

  const results = useMemo(() => {
    let list = products;
    if (activeFilters.includes("Знижки")) list = list.filter((p) => p.compareAtPrice > p.price);
    if (activeFilters.includes("★ 4.8+")) list = list.filter((p) => p.rating >= 4.8);
    if (activeFilters.includes("До 2 000 ₴")) list = list.filter((p) => p.price <= 2000);
    if (activeFilters.includes("У наявності")) list = list.filter((p) => p.stock > 0);
    return list;
  }, [products, activeFilters]);

  function toggleFilter(f: string) {
    setActiveFilters((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 pb-[110px]">
      <div className="sticky top-0 z-10 flex items-center gap-2.5 bg-bg py-4">
        <Link
          href="/feed"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border bg-surface"
        >
          ←
        </Link>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук серед 2 400 000 товарів…"
          className="flex-1 rounded-full border border-border bg-surface px-4.5 py-3 text-sm font-semibold text-text outline-none"
        />
      </div>

      <div className="relative -mx-4">
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%_-_28px),transparent)]">
          {filterDefs.map((f) => (
            <span
              key={f}
              onClick={() => toggleFilter(f)}
              className={`flex-none cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-bold hover:border-accent ${
                activeFilters.includes(f) ? "border-accent bg-accent text-white" : "border-border bg-surface text-text"
              }`}
            >
              {f}
            </span>
          ))}
          <span className="flex-none px-1" aria-hidden />
        </div>
      </div>

      <div className="mb-3 text-[13px] font-semibold text-muted">Знайдено {results.length} товарів</div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="cursor-pointer overflow-hidden rounded-card border border-border bg-surface hover:-translate-y-1 hover:shadow-card"
          >
            <img src={productImgUrl(p, 480, 600)} alt={p.name} className="block aspect-[4/5] w-full object-cover" />
            <div className="p-3.5 pb-4">
              <div className="text-[13.5px] font-bold leading-snug">{p.name}</div>
              <div className="mt-1 text-[11.5px] font-semibold text-muted">
                ★ {p.rating} · {p.category?.name}
              </div>
              <div className="mt-1.5 text-base font-extrabold">{formatPrice(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
