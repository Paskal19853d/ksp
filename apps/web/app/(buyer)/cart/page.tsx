"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/lib/store/AppStateContext";
import { products, imgUrl, formatPrice } from "@/lib/data/products";

export default function CartPage() {
  const router = useRouter();
  const { cart, incQty, decQty, removeFromCart, cartCount } = useAppState();
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const items = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.id) }))
    .filter((c) => c.product);

  const subtotal = items.reduce((sum, c) => sum + (c.product?.price ?? 0) * c.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal >= 1500 ? 0 : 60;
  const total = subtotal - discount + delivery;

  function applyPromo() {
    if (promoInput.trim().toUpperCase() === "TREE10") {
      setPromoApplied(true);
    }
  }

  return (
    <div className="mx-auto max-w-[860px] px-4 pb-[130px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/feed" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Кошик</h1>
        <span className="text-sm font-bold text-muted">{cartCount ? `${cartCount} товарів` : ""}</span>
      </div>

      {items.length === 0 ? (
        <div className="py-[70px] text-center text-muted">
          <div className="mb-3 text-[44px]">🛒</div>
          <div className="text-base font-extrabold text-text">Кошик порожній</div>
          <div className="mt-1.5 text-[13px] font-semibold">Додайте товари з ленти або каталогу</div>
          <button
            onClick={() => router.push("/feed")}
            className="mt-4.5 rounded-2xl bg-accent px-6.5 py-3 text-sm font-extrabold text-white"
          >
            До покупок
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {items.map((c) => (
              <div key={c.id} className="flex animate-slideUp gap-3.5 rounded-card border border-border bg-surface p-3">
                <img
                  src={imgUrl(c.product!.seed, 168, 200)}
                  alt={c.product!.name}
                  className="h-[100px] w-[84px] rounded-xl object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <div className="text-[13.5px] font-bold leading-snug">{c.product!.name}</div>
                  <div className="mt-1 text-[11.5px] font-semibold text-muted">{c.product!.seller}</div>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex items-center overflow-hidden rounded-[10px] bg-surface2">
                      <button onClick={() => decQty(c.id)} className="h-8 w-8 text-base font-extrabold">
                        −
                      </button>
                      <span className="w-7 text-center text-[13px] font-extrabold">{c.qty}</span>
                      <button onClick={() => incQty(c.id)} className="h-8 w-8 text-base font-extrabold">
                        +
                      </button>
                    </div>
                    <span className="text-base font-extrabold">{formatPrice(c.product!.price * c.qty)}</span>
                    <span
                      onClick={() => removeFromCart(c.id)}
                      className="ml-auto cursor-pointer text-[13px] font-bold text-muted hover:text-danger"
                    >
                      Видалити
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2.5">
            <input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Промокод (спробуйте TREE10)"
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3.5 text-[13.5px] font-semibold text-text outline-none"
            />
            <button
              onClick={applyPromo}
              className="rounded-xl bg-accent2 px-5.5 text-[13.5px] font-extrabold text-[#111] hover:brightness-105"
            >
              Застосувати
            </button>
          </div>
          {promoApplied && (
            <div className="mt-2 text-[12.5px] font-bold text-success">Промокод TREE10 застосовано ✓</div>
          )}

          <div className="mt-4 rounded-card border border-border bg-surface p-4.5">
            <div className="flex justify-between py-1.5 text-[13.5px] font-semibold text-muted">
              <span>Товари</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-1.5 text-[13.5px] font-bold text-success">
                <span>Знижка за промокодом</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 text-[13.5px] font-semibold text-muted">
              <span>Доставка</span>
              <span>{delivery === 0 ? "Безкоштовно" : formatPrice(delivery)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 text-[17px] font-extrabold">
              <span>Разом</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="mt-3.5 w-full rounded-2xl bg-accent py-3.5 text-[15px] font-extrabold text-white hover:brightness-110"
            >
              Оформити замовлення
            </button>
          </div>
        </>
      )}
    </div>
  );
}
