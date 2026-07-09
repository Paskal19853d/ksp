"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useBloggerState } from "@/lib/store/BloggerStateContext";
import { bloggerAvatarUrl } from "@/lib/data/blogger";

const navDef: [string, string][] = [
  ["/blogger/dash", "Дашборд"],
  ["/blogger/links", "Партнёрські посилання"],
  ["/blogger/content", "Контент-календар"],
  ["/blogger/videos", "Статистика відео"],
  ["/blogger/payouts", "Виплати"],
];

export function BloggerSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useBloggerState();

  return (
    <aside className="sticky top-0 hidden h-screen w-[230px] flex-none flex-col gap-1 border-r border-border p-3 lg:flex">
      <div className="px-3 pb-4 pt-1">
        <div className="font-display text-[17px] font-extrabold tracking-wide">TREETEX</div>
        <div className="mt-1 text-[10.5px] font-extrabold tracking-[.12em] text-accent2">БЛОГЕР</div>
      </div>
      {navDef.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-[13px] border-l-[3px] px-3.5 py-2.5 text-sm font-bold hover:bg-surface2",
              active ? "border-accent bg-surface2 text-text" : "border-transparent text-muted"
            )}
          >
            <span>{label}</span>
          </Link>
        );
      })}
      <div className="flex-1" />
      <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-2.5">
        <img src={bloggerAvatarUrl(25)} alt="Ірина Власенко" className="h-9 w-9 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-extrabold">Ірина Власенко</div>
          <div className="text-[10.5px] font-bold text-muted">@irina.vl</div>
        </div>
        <span onClick={toggleTheme} className="cursor-pointer text-sm text-muted">
          {theme === "dark" ? "☾" : "☀"}
        </span>
      </div>
    </aside>
  );
}

export function BloggerMobileNav() {
  const pathname = usePathname();
  return (
    <div className="relative -mx-4.5 lg:hidden">
      <div className="flex gap-2 overflow-x-auto px-4.5 pb-3.5 no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%_-_28px),transparent)]">
        {navDef.map(([href, label]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-none whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-extrabold",
                active ? "border-accent bg-accent text-white" : "border-border bg-surface text-text"
              )}
            >
              {label}
            </Link>
          );
        })}
        <span className="flex-none px-1" aria-hidden />
      </div>
    </div>
  );
}

export function sectionTitle(pathname: string | null) {
  return navDef.find(([href]) => href === pathname)?.[1] ?? "Дашборд";
}
