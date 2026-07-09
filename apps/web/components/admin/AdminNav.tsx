"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { avatarUrl } from "@/lib/data/admin";

const navDef: [string, string][] = [
  ["/admin/dash", "Статистика"],
  ["/admin/users", "Користувачі"],
  ["/admin/sellers", "Продавці"],
  ["/admin/moderation/videos", "Модерація відео"],
  ["/admin/moderation/products", "Модерація товарів"],
  ["/admin/moderation/comments", "Модерація коментарів"],
  ["/admin/reports", "Скарги"],
  ["/admin/finance", "Фінанси"],
  ["/admin/commissions", "Комісії"],
  ["/admin/categories", "Категорії"],
  ["/admin/banners", "Банери"],
  ["/admin/ads", "Реклама"],
  ["/admin/live", "Live трансляції"],
  ["/admin/cms", "CMS"],
  ["/admin/settings", "Налаштування платформи"],
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sellers, reports, videos, products, comments, theme, toggleTheme } = useAdminState();
  const pendingSellers = sellers.filter((s) => s.status === "На розгляді").length;
  const pendingReports = reports.filter((r) => r.status === "На розгляді").length;
  const pendingVideos = videos.filter((v) => v.status === "На розгляді").length;
  const pendingProducts = products.filter((p) => p.status === "На розгляді").length;
  const pendingComments = comments.filter((c) => c.status === "На розгляді").length;
  const badges: Record<string, string | null> = {
    "/admin/sellers": pendingSellers ? String(pendingSellers) : null,
    "/admin/reports": pendingReports ? String(pendingReports) : null,
    "/admin/moderation/videos": pendingVideos ? String(pendingVideos) : null,
    "/admin/moderation/products": pendingProducts ? String(pendingProducts) : null,
    "/admin/moderation/comments": pendingComments ? String(pendingComments) : null,
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] flex-none flex-col gap-1 overflow-y-auto border-r border-border p-3 no-scrollbar lg:flex">
      <div className="px-3 pb-4 pt-1">
        <div className="font-display text-[17px] font-extrabold tracking-wide">TREETEX</div>
        <div className="mt-1 text-[10.5px] font-extrabold tracking-[.12em] text-danger">АДМІНІСТРАТОР</div>
      </div>
      {navDef.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-[13px] border-l-[3px] px-3.5 py-2.5 text-[13px] font-bold hover:bg-surface2",
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
        <img src={avatarUrl(1)} alt="Адмін" className="h-9 w-9 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-extrabold">Root Admin</div>
          <div className="text-[10.5px] font-bold text-muted">Повний доступ</div>
        </div>
        <span onClick={toggleTheme} className="cursor-pointer text-sm text-muted">
          {theme === "dark" ? "☾" : "☀"}
        </span>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
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
  if (!pathname) return "Статистика";
  return navDef.find(([href]) => href === pathname)?.[1] ?? "Статистика";
}
