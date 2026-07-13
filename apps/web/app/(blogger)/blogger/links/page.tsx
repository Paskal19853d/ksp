"use client";

import { useState } from "react";
import { useBloggerState } from "@/lib/store/BloggerStateContext";
import { useAffiliateLinks } from "@/lib/data/useBlogger";
import { useProducts, productImgUrl } from "@/lib/data/useProducts";
import { Switch } from "@/components/ui/Switch";
import { ApiError } from "@/lib/api";

export default function BloggerLinksPage() {
  const { links, loading, createLink, toggleActive } = useAffiliateLinks();
  const { products } = useProducts({ limit: 100 });
  const { showToast } = useBloggerState();

  const [productId, setProductId] = useState("");
  const [code, setCode] = useState("");
  const [pct, setPct] = useState("");

  async function handleCreate() {
    const productIdNum = parseInt(productId, 10);
    const pctNum = parseInt(pct, 10);
    if (!productIdNum || !code.trim() || Number.isNaN(pctNum) || pctNum < 1 || pctNum > 50) {
      showToast("Вкажіть товар, код посилання та комісію 1–50%");
      return;
    }
    try {
      await createLink({ productId: productIdNum, code: code.trim(), pct: pctNum });
      showToast("Посилання створено ✓");
      setProductId("");
      setCode("");
      setPct("");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося створити посилання");
    }
  }

  async function handleToggle(link: (typeof links)[number]) {
    try {
      await toggleActive(link);
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося змінити статус");
    }
  }

  function copyCode(code: string) {
    navigator.clipboard?.writeText(`https://treetex.ua/r/${code}`).catch(() => {});
    showToast("Посилання скопійовано ✓");
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2.5">
        <div className="mb-0.5 text-[15px] font-extrabold">Активні посилання</div>
        {links.length === 0 && (
          <div className="py-6 text-center text-[13px] font-semibold text-muted">Посилань ще немає</div>
        )}
        {links.map((l) => (
          <div key={l.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4">
            {l.product && (
              <img src={productImgUrl(l.product, 90, 90)} alt={l.product.name} className="h-[54px] w-[54px] rounded-xl object-cover" />
            )}
            <div className="min-w-[160px] flex-[2]">
              <div className="text-[13px] font-extrabold">{l.product?.name}</div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
                treetex.ua/r/{l.code} · {l.pct}% з продажу
              </div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-muted">{l.clicks} кліків</div>
            </div>
            <button
              onClick={() => copyCode(l.code)}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
            >
              Копіювати
            </button>
            <Switch checked={l.active} onChange={() => handleToggle(l)} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 self-start rounded-card border border-border bg-surface p-5">
        <div className="text-[15px] font-extrabold">Нове партнёрське посилання</div>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        >
          <option value="">Оберіть товар</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Код посилання (напр. irina-hoodie)"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <input
          value={pct}
          onChange={(e) => setPct(e.target.value)}
          placeholder="Комісія, % (1–50)"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <button
          onClick={handleCreate}
          className="rounded-xl bg-accent py-3.5 text-[13.5px] font-extrabold text-white hover:brightness-110"
        >
          Створити посилання
        </button>
        <div className="text-[11.5px] font-semibold leading-relaxed text-muted">
          Комісія нараховується з кожного продажу товару, здійсненого за вашим унікальним посиланням.
        </div>
      </div>
    </div>
  );
}
