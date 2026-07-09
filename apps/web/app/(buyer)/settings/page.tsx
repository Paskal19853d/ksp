"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store/AppStateContext";

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

export default function SettingsPage() {
  const { theme, toggleTheme } = useAppState();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [liveReminders, setLiveReminders] = useState(true);

  return (
    <div className="mx-auto max-w-[640px] px-4 pb-[120px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Налаштування</h1>
      </div>

      <h2 className="mb-2.5 text-base font-extrabold">Вигляд</h2>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex items-center justify-between px-4.5 py-3.5">
          <div>
            <div className="text-[13.5px] font-extrabold">Темна тема</div>
            <div className="mt-0.5 text-[11.5px] font-semibold text-muted">Перемкнути оформлення інтерфейсу</div>
          </div>
          <Toggle on={theme === "dark"} onChange={toggleTheme} />
        </div>
      </div>

      <h2 className="mb-2.5 mt-5.5 text-base font-extrabold">Сповіщення</h2>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4.5 py-3.5">
          <div className="text-[13.5px] font-extrabold">Push-сповіщення</div>
          <Toggle on={pushNotifs} onChange={() => setPushNotifs((v) => !v)} />
        </div>
        <div className="flex items-center justify-between border-b border-border px-4.5 py-3.5">
          <div className="text-[13.5px] font-extrabold">Сповіщення на пошту</div>
          <Toggle on={emailNotifs} onChange={() => setEmailNotifs((v) => !v)} />
        </div>
        <div className="flex items-center justify-between px-4.5 py-3.5">
          <div>
            <div className="text-[13.5px] font-extrabold">Нагадування про ефіри</div>
            <div className="mt-0.5 text-[11.5px] font-semibold text-muted">Коли підписки виходять в прямий ефір</div>
          </div>
          <Toggle on={liveReminders} onChange={() => setLiveReminders((v) => !v)} />
        </div>
      </div>

      <h2 className="mb-2.5 mt-5.5 text-base font-extrabold">Мова</h2>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex items-center justify-between px-4.5 py-3.5">
          <span className="text-[13.5px] font-extrabold">Українська</span>
          <span className="text-accent">✓</span>
        </div>
      </div>
    </div>
  );
}
