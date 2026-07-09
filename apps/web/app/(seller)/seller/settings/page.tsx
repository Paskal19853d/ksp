"use client";

import { useState } from "react";
import { useSellerState } from "@/lib/store/SellerStateContext";

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="h-7 w-12 flex-none rounded-full transition-colors"
      style={{ background: on ? "var(--accent)" : "var(--surface2)" }}
    >
      <span
        className="block h-5 w-5 rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(24px)" : "translateX(4px)" }}
      />
    </button>
  );
}

export default function SellerSettingsPage() {
  const { showToast, theme, toggleTheme } = useSellerState();
  const [name, setName] = useState("TechnoHub");
  const [desc, setDesc] = useState(
    "Офіційний продавець електроніки та гаджетів в Україні. Гарантія на всі товари, доставка по всій країні."
  );
  const [autoPayouts, setAutoPayouts] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [reviewNotifs, setReviewNotifs] = useState(true);

  function saveProfile() {
    if (!name.trim()) {
      showToast("Вкажіть назву магазину");
      return;
    }
    showToast("Зміни збережено ✓");
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-5">
        <div className="mb-0.5 text-[15px] font-extrabold">Профіль магазину</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Назва магазину"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Опис магазину…"
          rows={4}
          className="resize-y rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed outline-none"
        />
        <button
          onClick={saveProfile}
          className="rounded-xl bg-accent py-3.5 text-[13.5px] font-extrabold text-white hover:brightness-110"
        >
          Зберегти зміни
        </button>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="mb-3 text-[15px] font-extrabold">Виплати</div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <div className="text-[13px] font-extrabold">Картка •• 4921</div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-muted">Прив'язана картка для виплат</div>
            </div>
            <button className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-[11.5px] font-extrabold hover:border-accent">
              Змінити
            </button>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-[13px] font-extrabold">Автовиплати щотижня</div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-muted">Кожного четверга на картку вище</div>
            </div>
            <Toggle on={autoPayouts} onChange={() => setAutoPayouts((v) => !v)} />
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="mb-3 text-[15px] font-extrabold">Сповіщення</div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-[13px] font-extrabold">Нові замовлення</span>
            <Toggle on={orderNotifs} onChange={() => setOrderNotifs((v) => !v)} />
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[13px] font-extrabold">Нові відгуки</span>
            <Toggle on={reviewNotifs} onChange={() => setReviewNotifs((v) => !v)} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-card border border-border bg-surface p-5">
          <span className="text-[13px] font-extrabold">Темна тема</span>
          <Toggle on={theme === "dark"} onChange={toggleTheme} />
        </div>
      </div>
    </div>
  );
}
