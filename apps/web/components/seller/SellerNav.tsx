"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useSellerState } from "@/lib/store/SellerStateContext";
import { avatarUrl } from "@/lib/data/seller";

const navDef: [string, string][] = [
  ["/seller/dash", "Дашборд"],
  ["/seller/orders", "Замовлення"],
  ["/seller/returns", "Повернення"],
  ["/seller/products", "Товари"],
  ["/seller/live", "Live Shopping"],
  ["/seller/finance", "Фінанси"],
  ["/seller/taxes", "Податки"],
  ["/seller/messages", "Повідомлення"],
  ["/seller/reviews", "Відгуки"],
  ["/seller/promos", "Акції та купони"],
  ["/seller/followers", "Підписники"],
  ["/seller/team", "Команда"],
];

const extraTitles: Record<string, string> = {
  "/seller/settings": "Налаштування магазину",
};

export function SellerSidebar() {
  const pathname = usePathname();
  const { orders, theme, toggleTheme } = useSellerState();
  const newCount = orders.filter((o) => o.status === "Новий").length;
  const badges: Record<string, string | null> = {
    "/seller/orders": newCount ? String(newCount) : null,
    "/seller/messages": "2",
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[230px] flex-none flex-col gap-1 border-r border-border p-3 lg:flex">
      <div className="px-3 pb-4 pt-1">
        <div className="font-display text-[17px] font-extrabold tracking-wide">TREETEX</div>
        <div className="mt-1 text-[10.5px] font-extrabold tracking-[.12em] text-accent2">ПРОДАВЕЦЬ</div>
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
            {badges[href] && (
              <span className="ml-auto rounded-full bg-danger px-1.5 py-0.5 text-[10.5px] font-extrabold text-white">
                {badges[href]}
              </span>
            )}
          </Link>
        );
      })}
      <div className="flex-1" />
      <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-2.5">
        <Link href="/seller/settings" className="flex min-w-0 flex-1 items-center gap-2.5">
          <img src={avatarUrl(33)} alt="TechnoHub" className="h-9 w-9 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-extrabold">TechnoHub</div>
            <div className="text-[10.5px] font-bold text-muted">★ 4.9 · Перевірений</div>
          </div>
        </Link>
        <span onClick={toggleTheme} className="cursor-pointer text-sm text-muted">
          {theme === "dark" ? "☾" : "☀"}
        </span>
      </div>
    </aside>
  );
}

export function SellerMobileNav() {
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
  if (!pathname) return "Дашборд";
  return navDef.find(([href]) => href === pathname)?.[1] ?? extraTitles[pathname] ?? "Дашборд";
}
