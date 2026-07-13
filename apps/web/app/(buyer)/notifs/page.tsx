"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNotifications, type NotificationType } from "@/lib/data/useNotifications";

const filters: (NotificationType | "all")[] = ["all", "order", "stream", "review", "payout"];

const filterLabels: Record<NotificationType | "all", string> = {
  all: "Всі",
  order: "Замовлення",
  stream: "Ефіри",
  review: "Відгуки",
  moderation: "Модерація",
  payout: "Виплати",
};

const iconBg: Record<NotificationType, string> = {
  order: "bg-accent",
  stream: "bg-danger",
  review: "bg-[#8B5CF6]",
  moderation: "bg-accent2 text-[#111]",
  payout: "bg-success",
};

const iconGlyph: Record<NotificationType, string> = {
  order: "🛍",
  stream: "●",
  review: "★",
  moderation: "!",
  payout: "₴",
};

export default function NotifsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const { notifications, loading, markRead, markAllRead } = useNotifications();

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  async function handleClick(id: number, link?: string) {
    await markRead(id);
    if (link) router.push(link);
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="mx-auto max-w-[680px] px-4 pb-[110px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/feed" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Сповіщення</h1>
        <span onClick={() => markAllRead()} className="ml-auto cursor-pointer text-[12.5px] font-extrabold text-accent">
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
              {filterLabels[f]}
            </span>
          ))}
          <span className="flex-none px-1" aria-hidden />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-[13px] font-semibold text-muted">Сповіщень немає</div>
        )}
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n.id, n.link)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 hover:border-accent"
          >
            <span
              className={`flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl text-[15px] text-white ${iconBg[n.type] ?? "bg-surface2"}`}
            >
              {iconGlyph[n.type] ?? "•"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-extrabold">{n.title}</div>
              {n.body && <div className="mt-0.5 text-xs font-semibold leading-tight text-muted">{n.body}</div>}
              <div className="mt-0.5 text-[11px] font-semibold text-muted">
                {new Date(n.createdAt).toLocaleString("uk-UA")}
              </div>
            </div>
            {!n.read && <span className="h-2.5 w-2.5 flex-none rounded-full bg-accent" />}
          </div>
        ))}
      </div>
    </div>
  );
}
