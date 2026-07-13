"use client";

import { useState } from "react";
import { bloggerDashboardByPeriod, bloggerTopProducts, bloggerImgUrl } from "@/lib/data/blogger";

// Intentionally still mock: a real version needs per-click event logs with
// timestamps (currently only a running total counter exists on
// AffiliateLinkEntity.clicks — see apps/api/src/blogger) and video view
// counts (no video-content entity yet, same gap noted in Moderation).
// Real, already-wired data: /blogger/links (clicks total, commission %) and
// /blogger/balance + /blogger/payouts — see blogger/links and blogger/payouts pages.

const periods = ["Сьогодні", "Тиждень", "Місяць"];

export default function BloggerDashPage() {
  const [period, setPeriod] = useState("Тиждень");
  const d = bloggerDashboardByPeriod[period];
  const max = Math.max(...d.bars);

  const kpis = [
    { label: "Перегляди", value: d.views, delta: "↑ 18% до попер. періоду" },
    { label: "Кліки за посиланнями", value: d.clicks, delta: "↑ 9%" },
    { label: "Конверсія", value: d.conv, delta: "↑ 0,3 п.п." },
    { label: "Дохід", value: d.income, delta: "↑ 22%" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {periods.map((p) => (
            <span
              key={p}
              onClick={() => setPeriod(p)}
              className="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-extrabold"
              style={{ background: period === p ? "var(--accent)" : "transparent", color: period === p ? "#fff" : "var(--muted)" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-card border border-border bg-surface p-4.5">
            <div className="text-xs font-bold text-muted">{k.label}</div>
            <div className="mt-1.5 text-2xl font-extrabold">{k.value}</div>
            <div className="mt-1.5 text-[11.5px] font-extrabold text-success">{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="text-[15px] font-extrabold">Перегляди — {period.toLowerCase()}</div>
          <div className="mt-4.5 flex h-[170px] items-end gap-2">
            {d.bars.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div
                  className="w-full max-w-[44px] rounded-t-lg rounded-b-sm"
                  style={{ height: `${(v / max) * 100}%`, background: v === max ? "var(--accent2)" : "var(--accent)" }}
                />
                <span className="text-[10.5px] font-bold text-muted">{d.labels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="mb-3.5 text-[15px] font-extrabold">Топ товари за кліками</div>
          <div className="flex flex-col gap-3">
            {bloggerTopProducts.map((tp) => (
              <div key={tp.name} className="flex items-center gap-2.5">
                <img src={bloggerImgUrl(tp.seed, 84, 84)} alt={tp.name} className="h-10.5 w-10.5 rounded-[10px] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-bold">{tp.name}</div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${tp.pct}%` }} />
                  </div>
                </div>
                <span className="text-[12.5px] font-extrabold">{tp.clicks}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
