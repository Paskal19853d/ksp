"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/AppStateContext";
import { formatPrice } from "@/lib/data/products";
import { useProducts } from "@/lib/data/useProducts";
import { api, ApiError } from "@/lib/api";
import type { Order } from "@treetex/shared";

const deliveryOpts = [
  { id: "nova", name: "Нова пошта, відділення", eta: "завтра", price: "60 ₴" },
  { id: "courier", name: "Кур'єр Нової пошти", eta: "завтра до 18:00", price: "90 ₴" },
  { id: "pickup", name: "Самовивіз із магазину", eta: "сьогодні", price: "Безкоштовно" },
];

const payOpts = [
  { id: "card", name: "Оплата карткою онлайн", eta: "Visa / Mastercard" },
  { id: "cod", name: "Оплата при отриманні", eta: "готівка або картка кур'єру" },
  { id: "wallet", name: "Гаманець TREETEX", eta: "баланс: 1 240 ₴" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart } = useAppState();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [addr, setAddr] = useState("");
  const [error, setError] = useState("");
  const [delivery, setDelivery] = useState("nova");
  const [pay, setPay] = useState("card");
  const [orderNo, setOrderNo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { products } = useProducts({ limit: 100 });

  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((c) => c.product);
  const subtotal = items.reduce((sum, c) => sum + (c.product?.price ?? 0) * c.qty, 0);
  const deliveryPrice = deliveryOpts.find((d) => d.id === delivery)?.price ?? "";
  const total = subtotal + (deliveryPrice === "Безкоштовно" ? 0 : parseInt(deliveryPrice) || 0);

  function goBack() {
    if (step === 1) router.push("/cart");
    else setStep((s) => s - 1);
  }

  function stepNext() {
    if (step === 1) {
      if (!name.trim() || !phone.trim() || !city.trim() || !addr.trim()) {
        setError("Заповніть усі поля");
        return;
      }
      setError("");
    }
    setStep((s) => Math.min(s + 1, 5));
  }

  async function confirmOrder() {
    setSubmitting(true);
    setError("");
    try {
      const order = await api.post<Order>("/orders", {
        items: items.map((c) => ({ productId: c.id, qty: c.qty })),
        recipientName: name,
        recipientPhone: phone,
        city,
        address: addr,
        deliveryMethod: delivery,
        paymentMethod: pay,
      });
      items.forEach((c) => removeFromCart(c.id));
      setOrderNo(order.orderNo);
      setStep(5);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Не вдалося оформити замовлення");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 pb-[120px]">
      <div className="flex items-center gap-2.5 py-4">
        <button onClick={goBack} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </button>
        <h1 className="m-0 text-xl font-extrabold">Оформлення</h1>
      </div>

      {step < 5 && (
        <div className="mb-5.5 flex gap-1.5">
          {[1, 2, 3, 4].map((d) => (
            <span
              key={d}
              className="h-1 flex-1 rounded"
              style={{ background: d <= step ? "var(--accent)" : "var(--surface2)" }}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex animate-slideUp flex-col gap-3">
          <h2 className="m-0 text-base font-extrabold">Отримувач і адреса</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я та прізвище" className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 __ ___ __ __" className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none" />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Місто" className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none" />
          <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Відділення / адреса доставки" className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none" />
          {error && <div className="text-[12.5px] font-bold text-danger">{error}</div>}
          <button onClick={stepNext} className="rounded-2xl bg-accent py-3.5 text-[15px] font-extrabold text-white hover:brightness-110">
            Далі — доставка
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex animate-slideUp flex-col gap-2.5">
          <h2 className="m-0 mb-1 text-base font-extrabold">Спосіб доставки</h2>
          {deliveryOpts.map((d) => (
            <div
              key={d.id}
              onClick={() => setDelivery(d.id)}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5"
              style={{ borderColor: delivery === d.id ? "var(--accent)" : "var(--border)" }}
            >
              <div className="flex-1">
                <div className="text-sm font-extrabold">{d.name}</div>
                <div className="text-xs font-semibold text-muted">{d.eta}</div>
              </div>
              <span className="text-sm font-extrabold">{d.price}</span>
            </div>
          ))}
          <button onClick={stepNext} className="mt-2 rounded-2xl bg-accent py-3.5 text-[15px] font-extrabold text-white hover:brightness-110">
            Далі — оплата
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex animate-slideUp flex-col gap-2.5">
          <h2 className="m-0 mb-1 text-base font-extrabold">Оплата</h2>
          {payOpts.map((d) => (
            <div
              key={d.id}
              onClick={() => setPay(d.id)}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5"
              style={{ borderColor: pay === d.id ? "var(--accent)" : "var(--border)" }}
            >
              <div className="flex-1">
                <div className="text-sm font-extrabold">{d.name}</div>
                <div className="text-xs font-semibold text-muted">{d.eta}</div>
              </div>
            </div>
          ))}
          <button onClick={stepNext} className="mt-2 rounded-2xl bg-accent py-3.5 text-[15px] font-extrabold text-white hover:brightness-110">
            Перевірити замовлення
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="flex animate-slideUp flex-col gap-3">
          <h2 className="m-0 text-base font-extrabold">Перевірка замовлення</h2>
          <div className="flex flex-col gap-2 rounded-card border border-border bg-surface p-4 text-[13.5px] font-semibold">
            <div className="flex justify-between gap-4">
              <span className="text-muted">Отримувач</span>
              <span className="text-right font-bold">{name}, {phone}, {city}, {addr}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted">Доставка</span>
              <span className="text-right font-bold">{deliveryOpts.find((d) => d.id === delivery)?.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted">Оплата</span>
              <span className="text-right font-bold">{payOpts.find((d) => d.id === pay)?.name}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-base font-extrabold">
              <span>Разом</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          {error && <div className="text-[12.5px] font-bold text-danger">{error}</div>}
          <button
            onClick={confirmOrder}
            disabled={submitting}
            className="rounded-2xl bg-accent2 py-4 text-[15px] font-extrabold text-[#111] hover:brightness-105 disabled:opacity-60"
          >
            {submitting ? "Оформлюємо…" : `Підтвердити та оплатити ${formatPrice(total)}`}
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="animate-slideUp py-[50px] text-center">
          <div className="mx-auto mb-4.5 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-success text-[34px] text-white">
            ✓
          </div>
          <h2 className="m-0 text-[22px] font-extrabold">Замовлення оформлено</h2>
          <div className="mt-2 text-sm font-semibold text-muted">
            Номер замовлення <b className="text-text">{orderNo}</b>
            <br />
            Очікуйте повідомлення про відправлення
          </div>
          <button
            onClick={() => router.push("/feed")}
            className="mt-5.5 rounded-2xl bg-accent px-7.5 py-3.5 text-sm font-extrabold text-white"
          >
            Повернутися до покупок
          </button>
        </div>
      )}
    </div>
  );
}
