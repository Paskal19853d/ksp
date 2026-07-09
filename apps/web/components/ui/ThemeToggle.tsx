"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="ml-auto flex cursor-pointer items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-2.5 text-[13px] font-extrabold hover:border-accent"
    >
      {theme === "dark" ? "☾ Темна тема" : "☀ Світла тема"}
    </div>
  );
}
