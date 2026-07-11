"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/lib/store/AppStateContext";
import { useProducts, toCardData } from "@/lib/data/useProducts";
import { ProductCard } from "@/components/ui/ProductCard";

export default function FavoritesPage() {
  const router = useRouter();
  const { favs, toggleFav, addToCart } = useAppState();
  const { products } = useProducts({ limit: 100 });

  const items = products.filter((p) => favs.includes(p.id));

  return (
    <div className="mx-auto max-w-[1060px] px-4 pb-[130px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Обране</h1>
        <span className="text-sm font-bold text-muted">{items.length ? `${items.length} товарів` : ""}</span>
      </div>

      {items.length === 0 ? (
        <div className="py-[70px] text-center text-muted">
          <div className="mb-3 text-[44px]">♡</div>
          <div className="text-base font-extrabold text-text">Тут поки що порожньо</div>
          <div className="mt-1.5 text-[13px] font-semibold">Додавайте товари в обране, натискаючи ♥ на картці</div>
          <button
            onClick={() => router.push("/feed")}
            className="mt-4.5 rounded-2xl bg-accent px-6.5 py-3 text-sm font-extrabold text-white"
          >
            До покупок
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <div key={p.id} className="relative">
              <div onClick={() => router.push(`/product/${p.id}`)}>
                <ProductCard product={toCardData(p)} onAddToCart={(id) => addToCart(id)} />
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFav(p.id);
                }}
                className="absolute right-2.5 top-2.5 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full bg-black/40 text-[15px] text-[#FF3B5C] backdrop-blur-sm"
              >
                ♥
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
