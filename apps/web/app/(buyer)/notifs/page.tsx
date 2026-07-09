"use client";

import { useState } from "react";
import Link from "next/link";
import { notifs as notifData } from "@/lib/data/products";

const filters = ["Всі", "Замовлення", "Ефіри", "Акції", "Соціальні"];

const iconBg: Record<string, string> = {
  Замовлення: "bg-accent",
  Ефіри: "bg-danger",
  Акції: "bg-accent2 text-[#111]",
  Соціальні: "bg-[#8B5CF6]",
};

export default function NotifsPage() {
  const [filter, setFilter] = useState("Всі");
  const [notifs, setNotifs] = useState(notifData);

  const filtered = filter === "Всі" ? notifs : notifs.filter((n) => n.type === filter);

  function markAllRead() {
    setNotifs((list) => list.map((n) => ({ ...n, unread: false })));
  }

  function readOne(id: number) {
    setNotifs((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  return (
    <div className="mx-auto max-w-[680px] px-4 pb-[110px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/feed" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Сповіщення</h1>
        <span onClick={markAllRead} className="ml-auto cursor-pointer text-[12.5px] font-extrabold text-accent">
          Прочитати всі
        </span>
      </div>

      <div className="relative -mx-4">
        <div className="flex gap-2 overflow-x-auto px-4 pb-3.5 no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%_-_28px),transparent)]">
          {filters.map((f) => (
            <span
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-none cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-bold ${
                filter === f ? "border-accent bg-accent text-white" : "border-border bg-surface text-text"
              }`}
            >
              {f}
            </span>
          ))}
          <span className="flex-none px-1" aria-hidden />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => readOne(n.id)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 hover:border-accent"
          >
            <span
              className={`flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl text-[15px] text-white ${iconBg[n.type] ?? "bg-surface2"}`}
            >
              {n.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-extrabold">{n.title}</div>
              <div className="mt-0.5 text-xs font-semibold leading-tight text-muted">{n.meta}</div>
            </div>
            {n.action && (
              <button className="flex-none rounded-[10px] bg-accent2 px-3.5 py-2 text-[11.5px] font-extrabold text-[#111]">
                {n.action}
              </button>
            )}
            {n.unread && <span className="h-2.5 w-2.5 flex-none rounded-full bg-accent" />}
          </div>
        ))}
      </div>
    </div>
  );
}
