"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAppState } from "@/lib/store/AppStateContext";

const navDef: [string, string][] = [
  ["/feed", "Головна"],
  ["/search", "Каталог"],
  ["/video", "Відео"],
  ["/live", "Live ефіри"],
  ["/chat", "Чат"],
  ["/notifs", "Сповіщення"],
  ["/cart", "Кошик"],
  ["/profile", "Профіль"],
];

const bottomNavDef: [string, string, string][] = [
  ["/feed", "⌂", "Головна"],
  ["/search", "⌕", "Каталог"],
  ["/video", "▶", "Відео"],
  ["/cart", "🛍", "Кошик"],
  ["/profile", "●", "Профіль"],
];

export function Sidebar() {
  const pathname = usePathname();
  const { cartCount, theme, toggleTheme } = useAppState();
  const unreadNotifs = 3;
  const badges: Record<string, string | null> = {
    "/cart": cartCount ? String(cartCount) : null,
    "/notifs": unreadNotifs ? String(unreadNotifs) : null,
    "/chat": "1",
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[236px] flex-none flex-col gap-1.5 border-r border-border p-3.5 lg:flex">
      <Link href="/feed" className="cursor-pointer px-2.5 pb-4.5 pt-1">
        <div className="font-display text-[19px] font-extrabold tracking-wide">TREETEX</div>
        <div className="mt-1.5 h-[3px] w-16 rounded bg-accent2" />
      </Link>
      {navDef.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl border-l-[3px] px-3.5 py-3 text-[15px] font-bold hover:bg-surface2",
              active ? "border-accent bg-surface2 text-text" : "border-transparent text-muted"
            )}
          >
            <span>{label}</span>
            {badges[href] && (
              <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[11px] font-extrabold text-white">
                {badges[href]}
              </span>
            )}
          </Link>
        );
      })}
      <div className="flex-1" />
      <div
        onClick={toggleTheme}
        className="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-3 hover:bg-surface2"
      >
        <span className="relative inline-block h-5 w-[34px] rounded-full border border-border bg-surface2">
          <span
            className={cn(
              "absolute top-[2px] h-3.5 w-3.5 rounded-full bg-accent transition-all",
              theme === "dark" ? "left-[2px]" : "left-[15px]"
            )}
          />
        </span>
        <span className="text-[13px] font-bold text-muted">
          {theme === "dark" ? "Темна тема" : "Світла тема"}
        </span>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useAppState();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 px-1 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg lg:hidden">
      {bottomNavDef.map(([href, icon, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-col items-center gap-0.5 px-2.5 py-1",
              active ? "text-accent" : "text-muted"
            )}
          >
            <span className="text-[19px] leading-none">{icon}</span>
            <span className="text-[10px] font-bold">{label}</span>
            {href === "/cart" && cartCount > 0 && (
              <span className="absolute -top-0.5 right-1.5 rounded-full bg-danger px-1.5 py-px text-[9px] font-extrabold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
