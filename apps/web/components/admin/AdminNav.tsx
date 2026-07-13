"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { useAuth } from "@/lib/store/AuthContext";
import { usePendingReports } from "@/lib/data/useReports";
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
  const router = useRouter();
  const { sellers, comments, theme, toggleTheme } = useAdminState();
  const { user, logout } = useAuth();
  const { reports: pendingReports } = usePendingReports();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }
  const pendingSellers = sellers.filter((s) => s.status === "На розгляді").length;
  const pendingComments = comments.filter((c) => c.status === "На розгляді").length;
  const pendingVideoReports = pendingReports.filter((r) => r.targetType === "video").length;
  const pendingProductReports = pendingReports.filter((r) => r.targetType === "product").length;
  const badges: Record<string, string | null> = {
    "/admin/sellers": pendingSellers ? String(pendingSellers) : null,
    "/admin/reports": pendingReports.length ? String(pendingReports.length) : null,
    "/admin/moderation/videos": pendingVideoReports ? String(pendingVideoReports) : null,
    "/admin/moderation/products": pendingProductReports ? String(pendingProductReports) : null,
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
        <img src={user?.avatarUrl || avatarUrl(1)} alt={user?.name ?? "Адмін"} className="h-9 w-9 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-extrabold">{user?.name ?? "Адмін"}</div>
          <div className="truncate text-[10.5px] font-bold text-muted">{user?.email ?? "Повний доступ"}</div>
        </div>
        <span onClick={toggleTheme} className="cursor-pointer text-sm text-muted">
          {theme === "dark" ? "☾" : "☀"}
        </span>
        <button
          onClick={handleLogout}
          title="Вийти"
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm text-muted hover:bg-surface2 hover:text-danger"
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

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
        <button
          onClick={handleLogout}
          title="Вийти"
          className="flex-none rounded-full border border-border bg-surface px-3.5 py-2 text-[12.5px] font-extrabold text-danger"
        >
          ⏻ Вийти
        </button>
        <span className="flex-none px-1" aria-hidden />
      </div>
    </div>
  );
}

export function sectionTitle(pathname: string | null) {
  if (!pathname) return "Статистика";
  return navDef.find(([href]) => href === pathname)?.[1] ?? "Статистика";
}
