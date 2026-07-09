"use client";

import { useState } from "react";
import { useBloggerState } from "@/lib/store/BloggerStateContext";
import { bloggerImgUrl } from "@/lib/data/blogger";
import { Switch } from "@/components/ui/Switch";

export default function BloggerLinksPage() {
  const { links, toggleLinkActive, createLink, showToast } = useBloggerState();
  const [productName, setProductName] = useState("");
  const [pct, setPct] = useState("");

  function handleCreate() {
    createLink(productName, parseInt(pct, 10));
    setProductName("");
    setPct("");
  }

  function copyCode(code: string) {
    navigator.clipboard?.writeText(`https://treetex.ua/r/${code}`).catch(() => {});
    showToast("Посилання скопійовано ✓");
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2.5">
        <div className="mb-0.5 text-[15px] font-extrabold">Активні посилання</div>
        {links.map((l) => (
          <div key={l.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4">
            <img src={bloggerImgUrl(l.seed, 90, 90)} alt={l.productName} className="h-[54px] w-[54px] rounded-xl object-cover" />
            <div className="min-w-[160px] flex-[2]">
              <div className="text-[13px] font-extrabold">{l.productName}</div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
                treetex.ua/r/{l.code} · {l.pct}% з продажу
              </div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
                {l.clicks} кліків · {l.orders} замовлень · {l.income}
              </div>
            </div>
            <button
              onClick={() => copyCode(l.code)}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
            >
              Копіювати
            </button>
            <Switch checked={l.active} onChange={() => toggleLinkActive(l.id)} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 self-start rounded-card border border-border bg-surface p-5">
        <div className="text-[15px] font-extrabold">Нове партнёрське посилання</div>
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Назва товару"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <input
          value={pct}
          onChange={(e) => setPct(e.target.value)}
          placeholder="Комісія, % (1–30)"
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
