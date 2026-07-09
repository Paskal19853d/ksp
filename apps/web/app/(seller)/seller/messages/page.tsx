"use client";

import { useState } from "react";
import { sellerThreads, sellerMessagesByThread, sellerQuickReplies, avatarUrl } from "@/lib/data/seller";

export default function SellerMessagesPage() {
  const [activeThread, setActiveThread] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(sellerMessagesByThread);

  const active = sellerThreads[activeThread];

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => ({ ...m, [activeThread]: [...(m[activeThread] ?? []), { me: true, text }] }));
    setInput("");
  }

  return (
    <div className="grid items-start gap-3.5 lg:grid-cols-[300px_1fr]">
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {sellerThreads.map((t, i) => (
          <div
            key={t.name}
            onClick={() => setActiveThread(i)}
            className="flex cursor-pointer items-center gap-2.5 border-b border-border p-3.5 last:border-0 hover:bg-surface2"
            style={{ background: activeThread === i ? "var(--surface2)" : undefined }}
          >
            <img src={avatarUrl(t.av)} alt={t.name} className="h-[42px] w-[42px] rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold">{t.name}</div>
              <div className="truncate text-[11.5px] font-semibold text-muted">{t.last}</div>
            </div>
            {t.unread > 0 && activeThread !== i && (
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                {t.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex min-h-[420px] flex-col rounded-card border border-border bg-surface">
        <div className="border-b border-border px-4.5 py-3.5 text-sm font-extrabold">{active.name}</div>
        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
          {(messages[activeThread] ?? []).map((m, i) => (
            <div
              key={i}
              className="max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] font-semibold leading-snug"
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
        <div className="flex gap-2 overflow-x-auto px-3.5 pb-1 pt-2 no-scrollbar">
          {sellerQuickReplies.map((q) => (
            <span
              key={q}
              onClick={() => send(q)}
              className="flex-none cursor-pointer whitespace-nowrap rounded-full border border-border bg-surface2 px-3.5 py-1.5 text-[11.5px] font-bold hover:border-accent"
            >
              {q}
            </span>
          ))}
        </div>
        <div className="flex gap-2.5 p-3.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Відповісти покупцю…"
            className="flex-1 rounded-full border border-border bg-surface2 px-4 py-2.5 text-[13px] font-semibold outline-none"
          />
          <button onClick={() => send(input)} className="h-[42px] w-[42px] rounded-full bg-accent text-[15px] text-white">
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
