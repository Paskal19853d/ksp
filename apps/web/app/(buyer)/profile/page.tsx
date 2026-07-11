"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/AppStateContext";
import { useAuth } from "@/lib/store/AuthContext";
import { avatarUrl, imgUrl, orders } from "@/lib/data/products";

const statusColors: Record<string, string> = {
  Доставлено: "bg-success text-white",
  "В дорозі": "bg-[#8B5CF6] text-white",
  Скасовано: "bg-danger text-white",
};

const profileMenu = [
  { label: "Обране", href: "/favorites" },
  { label: "Підписки", href: "/subscriptions" },
  { label: "Купони та бонуси", href: "/coupons" },
  { label: "Гаманець", href: "/wallet" },
  { label: "Безпека", href: "/security" },
  { label: "Налаштування", href: "/settings" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useAppState();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 pb-[120px]">
      <div className="flex items-center gap-3.5 py-6 pb-2">
        <img
          src={user?.avatarUrl || avatarUrl(5)}
          alt="профіль"
          className="h-[72px] w-[72px] rounded-full border-[3px] border-accent object-cover"
        />
        <div className="flex-1">
          <div className="text-[19px] font-extrabold">{user?.name}</div>
          <div className="text-[13px] font-semibold text-muted">{user?.email}</div>
        </div>
        <button
          onClick={toggleTheme}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-border bg-surface"
        >
          {theme === "dark" ? "☾" : "☀"}
        </button>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        <div className="rounded-card bg-accent p-4.5 text-white">
          <div className="text-xs font-bold opacity-80">Баланс гаманця</div>
          <div className="mt-1 text-2xl font-extrabold">1 240 ₴</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Бонуси TREETEX</div>
          <div className="mt-1 text-2xl font-extrabold text-accent2">380</div>
        </div>
      </div>

      <h2 className="mb-2.5 mt-5.5 text-base font-extrabold">Мої замовлення</h2>
      <div className="flex flex-col gap-2">
        {orders.map((o) => (
          <div key={o.no} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <img src={imgUrl(o.seed, 88, 88)} alt="замовлення" className="h-11 w-11 rounded-[10px] object-cover" />
            <div className="flex-1">
              <div className="text-[13px] font-extrabold">{o.no}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                {o.date} · {o.sum}
              </div>
            </div>
            <span className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[o.status]}`}>
              {o.status}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/become-seller"
        className="mt-5.5 flex items-center gap-3.5 rounded-card bg-gradient-to-br from-accent to-[#173FA8] p-4.5 text-white"
      >
        <div className="flex-1">
          <div className="text-[15px] font-extrabold">Стати продавцем TREETEX</div>
          <div className="mt-1 text-[12.5px] font-semibold opacity-85">
            Відкрийте свій магазин і почніть продавати за кілька хвилин
          </div>
        </div>
        <span className="text-xl">→</span>
      </Link>

      <Link
        href="/blogger/dash"
        className="mt-2.5 flex items-center gap-3.5 rounded-card border border-border bg-surface p-4.5"
      >
        <div className="flex-1">
          <div className="text-[15px] font-extrabold">Кабінет блогера</div>
          <div className="mt-1 text-[12.5px] font-semibold text-muted">
            Заробляйте на партнёрських посиланнях без власних товарів
          </div>
        </div>
        <span className="text-xl text-accent">→</span>
      </Link>

      <h2 className="mb-2.5 mt-5.5 text-base font-extrabold">Меню</h2>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {profileMenu.map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className="flex cursor-pointer items-center justify-between border-b border-border px-4.5 py-3.5 text-sm font-bold last:border-0 hover:bg-surface2"
          >
            <span>{m.label}</span>
            <span className="text-muted">→</span>
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-5.5 w-full rounded-card border border-border bg-surface py-3.5 text-sm font-extrabold text-danger hover:border-danger"
      >
        Вийти з акаунту
      </button>
    </div>
  );
}
