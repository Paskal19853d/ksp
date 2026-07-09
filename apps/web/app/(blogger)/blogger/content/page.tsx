"use client";

import { useState } from "react";
import { useBloggerState } from "@/lib/store/BloggerStateContext";
import type { ContentItem } from "@/lib/data/blogger";

const statusColors: Record<string, string> = {
  Заплановано: "bg-accent2 text-[#111]",
  Опубліковано: "bg-success text-white",
  Чернетка: "bg-surface2 text-muted",
};

const contentTypes: ContentItem["type"][] = ["Відео", "Ефір", "Пост"];

export default function BloggerContentPage() {
  const { content, addContent, setContentStatus } = useBloggerState();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContentItem["type"]>("Відео");
  const [date, setDate] = useState("");

  function handleAdd() {
    addContent(title, type, date);
    setTitle("");
    setDate("");
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2.5">
        <div className="mb-0.5 text-[15px] font-extrabold">Контент-календар</div>
        {content.map((c) => (
          <div key={c.id} className="rounded-card border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-surface2 px-2.5 py-1 text-[11px] font-extrabold text-muted">{c.type}</span>
              <span className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[c.status]}`}>
                {c.status}
              </span>
            </div>
            <div className="mt-2 text-[13.5px] font-extrabold">{c.title}</div>
            <div className="mt-0.5 text-[11.5px] font-semibold text-muted">{c.date}</div>
            {c.status !== "Опубліковано" && (
              <div className="mt-2.5 flex gap-2">
                {c.status === "Чернетка" && (
                  <button
                    onClick={() => setContentStatus(c.id, "Заплановано")}
                    className="rounded-[10px] bg-accent px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
                  >
                    Запланувати
                  </button>
                )}
                {c.status === "Заплановано" && (
                  <button
                    onClick={() => setContentStatus(c.id, "Опубліковано")}
                    className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
                  >
                    Позначити опублікованим
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 self-start rounded-card border border-border bg-surface p-5">
        <div className="text-[15px] font-extrabold">Додати в календар</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Назва контенту"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <div className="flex flex-wrap gap-1.5">
          {contentTypes.map((t) => (
            <span
              key={t}
              onClick={() => setType(t)}
              className="cursor-pointer rounded-[10px] border-[1.5px] px-3.5 py-2 text-xs font-bold"
              style={{
                borderColor: type === t ? "var(--accent)" : "var(--border)",
                background: type === t ? "var(--accent)" : "var(--surface2)",
                color: type === t ? "#fff" : "var(--text)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Дата, напр. 15 липня, 18:00"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <button
          onClick={handleAdd}
          className="rounded-xl bg-accent py-3.5 text-[13.5px] font-extrabold text-white hover:brightness-110"
        >
          Додати
        </button>
      </div>
    </div>
  );
}
