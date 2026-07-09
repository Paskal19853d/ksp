"use client";

import { useState } from "react";
import Link from "next/link";
import { avatarUrl, shopByName } from "@/lib/data/products";

const threads = [
  { id: 0, name: "TechnoHub", img: avatarUrl(33), last: "До речі, до навушників радимо чохол — сьогодні на нього −20%.", unread: 2 },
  { id: 1, name: "GlowUp", img: avatarUrl(45), last: "Сьогодні о 19:00 великий ефір зі знижками до −40%!", unread: 0 },
  { id: 2, name: "StyleWay", img: avatarUrl(12), last: "Вітаю! Так, унісекс. На 175 см радимо M.", unread: 0 },
];

const messagesByThread: Record<number, { me: boolean; text: string }[]> = {
  0: [
    { me: false, text: "Вітаю! Ваше замовлення TX-284913 передано в Нову пошту, ТТН 2045 0092 1183." },
    { me: true, text: "Дякую! А можна змінити відділення на №42?" },
    { me: false, text: "Так, змінив на відділення №42, Київ. Посилка буде завтра до 14:00." },
    { me: false, text: "До речі, до навушників радимо чохол — сьогодні на нього −20% в ефірі." },
  ],
  1: [
    { me: false, text: "Сьогодні о 19:00 великий ефір зі знижками до −40% на догляд. Приходьте!" },
    { me: true, text: "Буду! Відкладіть, будь ласка, сироватку з вітаміном C." },
  ],
  2: [
    { me: true, text: "Добрий день! Худі Oversize — це унісекс модель? Який розмір на зріст 175?" },
    { me: false, text: "Вітаю! Так, унісекс. На 175 см радимо M — посадка вільна." },
  ],
};

const quickReplies = ["Дякую!", "Коли доставка?", "Є інші кольори?"];

export default function ChatPage() {
  const [activeThread, setActiveThread] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(messagesByThread);

  const active = threads.find((t) => t.id === activeThread)!;

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => ({ ...m, [activeThread]: [...m[activeThread], { me: true, text }] }));
    setInput("");
  }

  return (
    <div className="mx-auto max-w-[980px] px-4 pb-[110px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/feed" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Повідомлення</h1>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-[300px_1fr]">
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveThread(t.id)}
              className="flex cursor-pointer items-center gap-3 border-b border-border p-3.5 last:border-0 hover:bg-surface2"
              style={{ background: activeThread === t.id ? "var(--surface2)" : undefined }}
            >
              <img src={t.img} alt={t.name} className="h-11 w-11 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[13px] font-extrabold">
                  {t.name} <span className="text-[11px] text-accent">✓</span>
                </div>
                <div className="truncate text-[11.5px] font-semibold text-muted">{t.last}</div>
              </div>
              {t.unread > 0 && (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                  {t.unread}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex min-h-[420px] flex-col rounded-card border border-border bg-surface">
          <div className="flex items-center gap-2.5 border-b border-border px-4.5 py-3.5">
            <img src={active.img} alt={active.name} className="h-[34px] w-[34px] rounded-[11px] object-cover" />
            <div className="flex-1">
              <div className="text-[13.5px] font-extrabold">{active.name}</div>
              <div className="text-[11px] font-bold text-success">Онлайн · відповідає ~5 хв</div>
            </div>
            <Link
              href={`/shop/${shopByName(active.name).id}`}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-[11.5px] font-extrabold hover:border-accent"
            >
              Магазин
            </Link>
          </div>
          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
            {messages[activeThread].map((m, i) => (
              <div
                key={i}
                className="max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13.5px] font-semibold"
                style={{
                  alignSelf: m.me ? "flex-end" : "flex-start",
                  background: m.me ? "var(--accent)" : "var(--surface2)",
                  color: m.me ? "#fff" : "var(--text)",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto px-3.5 pb-1 pt-2 no-scrollbar [mask-image:linear-gradient(to_right,black_calc(100%_-_28px),transparent)]">
            {quickReplies.map((q) => (
              <span
                key={q}
                onClick={() => send(q)}
                className="flex-none cursor-pointer whitespace-nowrap rounded-full border border-border bg-surface2 px-3.5 py-1.5 text-[11.5px] font-bold hover:border-accent"
              >
                {q}
              </span>
            ))}
            <span className="flex-none px-1" aria-hidden />
          </div>
          <div className="flex gap-2.5 p-3.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Написати повідомлення…"
              className="min-w-0 flex-1 rounded-full border border-border bg-surface2 px-4 py-2.5 text-[13px] font-semibold outline-none"
            />
            <button
              onClick={() => send(input)}
              className="h-[42px] w-[42px] flex-none rounded-full bg-accent text-[15px] text-white"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
