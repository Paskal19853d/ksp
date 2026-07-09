"use client";

import { useState } from "react";
import {
  Button,
  Badge,
  Tag,
  CountBadge,
  Input,
  Switch,
  Checkbox,
  Progress,
  Spinner,
  Rating,
  Tabs,
  Pagination,
  Breadcrumbs,
  ProductCardSkeleton,
  EmptyState,
  ProductCard,
  SellerCard,
  VideoCard,
  LiveCard,
  Modal,
  Toast,
  Tooltip,
  OrdersTable,
  NotificationItem,
  ThemeToggle,
} from "@/components/ui";

const colors = [
  { name: "Accent / Blue", hex: "#2E6BFF" },
  { name: "Accent 2 / Yellow", hex: "#FFD337" },
  { name: "Background", hex: "var(--bg)" },
  { name: "Surface", hex: "var(--surface)" },
  { name: "Surface 2", hex: "var(--surface2)" },
  { name: "Danger / Live", hex: "#FF3B5C" },
  { name: "Success", hex: "#22C55E" },
  { name: "Muted text", hex: "var(--muted)" },
];

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export default function UiKitPage() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [switchOn, setSwitchOn] = useState(true);
  const [checkOn, setCheckOn] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function fireToast() {
    setToast("Дію виконано ✓");
    setTimeout(() => setToast(null), 2000);
  }

  const tabTexts = [
    "Список товарів магазину з фільтрами та сортуванням.",
    "Відгуки покупців з оцінками та фото.",
    "Опис, контакти, графік роботи та політика повернення.",
  ];

  return (
    <main className="min-h-screen bg-bg pb-20 font-sans text-text">
      <div className="mx-auto max-w-[1080px] px-5.5">
        <div className="flex flex-wrap items-center gap-3.5 py-7">
          <div>
            <div className="font-display text-2xl font-extrabold tracking-wide">TREETEX</div>
            <div className="mt-1.5 text-xs font-extrabold tracking-[.14em] text-muted">
              DESIGN SYSTEM · UI KIT · v1.0
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="mb-7 h-1 w-[84px] rounded bg-accent2" />

        <h2 className="mb-3.5 text-[17px] font-extrabold">01 · Кольори</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {colors.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="h-16 border-b border-border" style={{ background: c.hex }} />
              <div className="px-3.5 py-2.5">
                <div className="text-[12.5px] font-extrabold">{c.name}</div>
                <div className="font-mono text-[11px] font-bold text-muted">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">02 · Типографіка</h2>
        <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
          <div>
            <div className="font-display text-[32px] font-extrabold">Display / Unbounded 800</div>
            <div className="mt-1 text-[11px] font-bold text-muted">Логотип, великі заголовки · 32–48px</div>
          </div>
          <div className="text-2xl font-extrabold">H1 / Manrope 800 · 24px — Заголовок екрана</div>
          <div className="text-[17px] font-extrabold">H2 / Manrope 800 · 17px — Заголовок секції</div>
          <div className="text-sm font-bold">Body Bold / Manrope 700 · 14px — Назви товарів, кнопки</div>
          <div className="text-sm font-semibold leading-[1.55]">
            Body / Manrope 600 · 14px — основний текст інтерфейсу, описи товарів і повідомлення чатів.
          </div>
          <div className="text-xs font-bold text-muted">Caption / Manrope 700 · 12px — метадані, підписи, рейтинги</div>
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">03 · Кнопки</h2>
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-surface p-6">
          <Button variant="primary" onClick={fireToast}>Primary</Button>
          <Button variant="buy" onClick={fireToast}>Buy Now</Button>
          <Button variant="secondary" onClick={fireToast}>Secondary</Button>
          <Button variant="ghost" onClick={fireToast}>Ghost</Button>
          <Button variant="live" onClick={fireToast}>● Live</Button>
          <Button variant="secondary" disabled>Disabled</Button>
          <Button variant="icon" onClick={fireToast}>♥</Button>
          <Button variant="pill" onClick={fireToast}>Small pill</Button>
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">04 · Поля вводу та контролі</h2>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6">
            <Input placeholder="Стандартне поле" />
            <Input value="З помилкою" readOnly error="Перевірте формат номера телефону" />
            <Input placeholder="⌕ Поле пошуку" pill />
            <div className="flex flex-wrap gap-2">
              {["Нова пошта", "Кур'єр", "Самовивіз"].map((o) => (
                <Tag key={o}>{o}</Tag>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
            <Switch
              checked={switchOn}
              onChange={() => setSwitchOn((v) => !v)}
              label={`Перемикач — ${switchOn ? "увімкнено" : "вимкнено"}`}
            />
            <Checkbox
              checked={checkOn}
              onChange={() => setCheckOn((v) => !v)}
              label="Чекбокс — умови та політика"
            />
            <Progress value={68} label="Прогрес завантаження" />
            <Spinner label="Loader / Spinner" />
            <Rating value={4} label="4.0 · Рейтинг" />
          </div>
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">05 · Бейджі, теги, статуси</h2>
        <div className="flex flex-wrap items-center gap-2.5 rounded-card border border-border bg-surface p-6">
          <Badge variant="live">LIVE</Badge>
          <Badge variant="discount">−30%</Badge>
          <Badge variant="new">Новинка</Badge>
          <Badge variant="success">Доставлено</Badge>
          <Badge variant="hidden">Прихований</Badge>
          <Badge variant="verified">✓ Перевірений продавець</Badge>
          <Badge variant="vip">VIP</Badge>
          <Badge variant="premium">Premium</Badge>
          <Tag onRemove={() => {}}>Тег-фільтр</Tag>
          <CountBadge count={12} />
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">06 · Вкладки, пагінація, хлібні крихти</h2>
        <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-6">
          <Tabs items={["Товари", "Відгуки", "Про магазин"]} active={tab} onChange={setTab} />
          <div className="text-[13px] font-semibold text-muted">{tabTexts[tab]}</div>
          <Pagination total={24} page={page} onChange={setPage} />
          <Breadcrumbs
            items={[{ label: "Головна", href: "#" }, { label: "Електроніка", href: "#" }, { label: "Навушники" }]}
          />
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">07 · Skeleton та порожні стани</h2>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <ProductCardSkeleton />
          <EmptyState
            title="Нічого не знайдено"
            description="Спробуйте змінити запит або скинути фільтри"
            actionLabel="Скинути фільтри"
          />
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">08 · Картки: товар, продавець, відео, ефір</h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          <ProductCard
            product={{
              id: 1,
              name: "Бездротові навушники AirSound Pro",
              price: 2499,
              oldPrice: 3199,
              rating: 4.8,
              reviewCount: 1243,
              badgeLabel: "−22%",
              imageUrl: img("earbudsx", 440, 550),
            }}
            onAddToCart={fireToast}
          />
          <SellerCard
            seller={{
              id: 1,
              name: "TechnoHub",
              verified: true,
              rating: 4.9,
              followerCount: "48,3K",
              productCount: 312,
              avatarUrl: img("shopcover", 200, 200),
            }}
            onFollow={fireToast}
          />
          <VideoCard
            video={{
              id: 1,
              title: "Тест шумозаглушення в метро",
              author: "technohub",
              likeCount: "45,1K",
              viewCount: "45K",
              thumbnailUrl: img("videarbuds", 400, 530),
            }}
          />
          <LiveCard
            stream={{
              id: 1,
              title: "Розпродаж косметики −40%",
              host: "GlowUp Beauty",
              viewerCount: "2,3K",
              thumbnailUrl: img("livebeauty", 400, 530),
            }}
            onWatch={fireToast}
          />
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">09 · Модальні вікна, тости, підказки</h2>
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-border bg-surface p-6">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Відкрити модальне вікно
          </Button>
          <Button variant="secondary" onClick={fireToast}>
            Показати toast
          </Button>
          <span className="relative inline-block">
            <Button variant="secondary" onClick={() => setTipOpen((v) => !v)}>
              Tooltip ?
            </Button>
            <Tooltip open={tipOpen}>Спливаюча підказка</Tooltip>
          </span>
        </div>

        <h2 className="mb-3.5 mt-8.5 text-[17px] font-extrabold">10 · Таблиця та сповіщення</h2>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <OrdersTable
            rows={[
              { no: "TX-284913", sum: "2 499 ₴", status: "В дорозі", statusVariant: "purple" },
              { no: "TX-284880", sum: "1 990 ₴", status: "Пакується", statusVariant: "warning" },
              { no: "TX-284702", sum: "4 290 ₴", status: "Доставлено", statusVariant: "success" },
            ]}
          />
          <div className="flex flex-col gap-2.5">
            <NotificationItem
              icon="🛍"
              iconVariant="accent"
              title="Замовлення відправлено"
              meta="TX-284913 · Нова пошта · 5 хв тому"
            />
            <NotificationItem
              icon="●"
              iconVariant="danger"
              title="GlowUp Beauty розпочала ефір"
              meta="Знижки до −40% · зараз"
              actionLabel="Дивитись"
              onAction={fireToast}
            />
            <NotificationItem
              icon="✓"
              iconVariant="success"
              title="Нарахування бонусів"
              meta="+64 бонуси за відгук · вчора"
            />
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="Видалити товар з кошика?"
        description="«Бездротові навушники AirSound Pro» буде прибрано. Ви завжди можете додати товар знову з обраного."
        onCancel={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
      />
      <Toast message={toast} />
    </main>
  );
}
