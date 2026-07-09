export type UserRole = "Покупець" | "Продавець" | "Блогер" | "Компанія";
export type UserStatus = "Активний" | "Заблокований";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  orders: number;
  av: number;
}

export const adminUsers: AdminUser[] = [
  { id: 1, name: "Олена Коваленко", email: "olena.kv@gmail.com", role: "Покупець", status: "Активний", joined: "12 березня 2026", orders: 14, av: 5 },
  { id: 2, name: "Максим Демченко", email: "maxdem@gmail.com", role: "Покупець", status: "Активний", joined: "3 квітня 2026", orders: 6, av: 14 },
  { id: 3, name: "TechnoHub", email: "shop@technohub.ua", role: "Продавець", status: "Активний", joined: "8 січня 2026", orders: 2840, av: 33 },
  { id: 4, name: "StyleWay", email: "hello@styleway.ua", role: "Продавець", status: "Активний", joined: "15 січня 2026", orders: 1920, av: 12 },
  { id: 5, name: "Ірина Власенко", email: "irina.vl@gmail.com", role: "Блогер", status: "Активний", joined: "22 лютого 2026", orders: 3, av: 25 },
  { id: 6, name: "Андрій Савчук", email: "andrii.s@gmail.com", role: "Покупець", status: "Заблокований", joined: "5 травня 2026", orders: 1, av: 53 },
  { id: 7, name: "GlowUp Cosmetics LLC", email: "biz@glowup.ua", role: "Компанія", status: "Активний", joined: "18 січня 2026", orders: 940, av: 45 },
  { id: 8, name: "Марта Литвин", email: "marta.l@gmail.com", role: "Покупець", status: "Активний", joined: "9 червня 2026", orders: 8, av: 32 },
];

export interface AdminSeller {
  id: number;
  name: string;
  email: string;
  category: string;
  status: "На розгляді" | "Схвалено" | "Відхилено";
  revenue: string;
  products: number;
  rating: number;
  av: number;
}

export const adminSellers: AdminSeller[] = [
  { id: 1, name: "TechnoHub", email: "shop@technohub.ua", category: "Електроніка", status: "Схвалено", revenue: "3,42 млн ₴", products: 214, rating: 4.9, av: 33 },
  { id: 2, name: "StyleWay", email: "hello@styleway.ua", category: "Мода", status: "Схвалено", revenue: "1,86 млн ₴", products: 156, rating: 4.8, av: 12 },
  { id: 3, name: "GlowUp", email: "biz@glowup.ua", category: "Краса", status: "Схвалено", revenue: "940 300 ₴", products: 87, rating: 4.9, av: 45 },
  { id: 4, name: "HomeLab", email: "info@homelab.ua", category: "Дім", status: "Схвалено", revenue: "612 400 ₴", products: 64, rating: 4.7, av: 60 },
  { id: 5, name: "SneakerCity", email: "contact@sneakercity.ua", category: "Мода", status: "На розгляді", revenue: "—", products: 0, rating: 0, av: 8 },
  { id: 6, name: "PetShop Ua", email: "hello@petshop.ua", category: "Тварини", status: "На розгляді", revenue: "—", products: 0, rating: 0, av: 15 },
];

export const adminDashboard = {
  totalUsers: "128 400",
  totalSellers: "612",
  totalOrders: "84 200",
  gmv: "48,6 млн ₴",
  bars: [42, 55, 38, 70, 62, 88, 74, 66, 80, 58, 90, 96],
  labels: ["С", "Л", "Б", "К", "Т", "Ч", "Л", "С", "В", "Ж", "Л", "Г"],
};

export const adminReports = [
  { count: 18, label: "Скарги на товари", severity: "danger" as const },
  { count: 7, label: "Скарги на продавців", severity: "danger" as const },
  { count: 32, label: "Скарги на коментарі", severity: "warning" as const },
  { count: 4, label: "Скарги на відео", severity: "warning" as const },
];

export function avatarUrl(n: number) {
  return `https://i.pravatar.cc/100?img=${n}`;
}

export interface AdminPayout {
  seller: string;
  date: string;
  sum: string;
  commission: string;
  status: "Виплачено" | "В обробці";
}

export const adminPayouts: AdminPayout[] = [
  { seller: "TechnoHub", date: "4 липня 2026", sum: "74 120 ₴", commission: "7 412 ₴", status: "Виплачено" },
  { seller: "StyleWay", date: "4 липня 2026", sum: "52 380 ₴", commission: "5 238 ₴", status: "Виплачено" },
  { seller: "GlowUp", date: "27 червня 2026", sum: "38 940 ₴", commission: "3 894 ₴", status: "Виплачено" },
  { seller: "HomeLab", date: "27 червня 2026", sum: "21 460 ₴", commission: "2 146 ₴", status: "Виплачено" },
  { seller: "TechnoHub", date: "11 липня 2026", sum: "68 900 ₴", commission: "6 890 ₴", status: "В обробці" },
];

export const adminFinanceSummary = {
  gmv: "48,6 млн ₴",
  platformRevenue: "4,86 млн ₴",
  pendingPayouts: "68 900 ₴",
  avgCommission: "10%",
};

export interface AdminCommissionRule {
  category: string;
  pct: number;
}

export const adminCommissions: AdminCommissionRule[] = [
  { category: "Електроніка", pct: 8 },
  { category: "Мода", pct: 12 },
  { category: "Краса", pct: 10 },
  { category: "Дім", pct: 9 },
  { category: "Спорт", pct: 10 },
  { category: "Дитяче", pct: 11 },
  { category: "Авто", pct: 7 },
];

export type ModerationStatus = "На розгляді" | "Схвалено" | "Відхилено";

export interface ModerationVideo {
  id: number;
  author: string;
  caption: string;
  seed: string;
  reason: string;
  status: ModerationStatus;
}

export const moderationVideos: ModerationVideo[] = [
  { id: 1, author: "@style.way", caption: "Худі Oversize — розбираємо якість пошиття та посадку.", seed: "vidhoodie", reason: "Скарга: підозра на введення в оману щодо складу тканини", status: "На розгляді" },
  { id: 2, author: "@technohub", caption: "Тест AirSound Pro у метро: активне шумозаглушення.", seed: "videarbuds", reason: "Автоперевірка: гучний фоновий звук поза стандартами", status: "На розгляді" },
  { id: 3, author: "@unknown.trader", caption: "Найдешевші iPhone з Китаю, пишіть в директ", seed: "sketchyphone", reason: "Скарга: підозра на шахрайство поза платформою", status: "На розгляді" },
];

export interface ModerationProduct {
  id: number;
  name: string;
  seller: string;
  seed: string;
  reason: string;
  status: ModerationStatus;
}

export const moderationProducts: ModerationProduct[] = [
  { id: 1, name: "Годинник \"Rolex\" копія люкс", seller: "FastDeals24", seed: "fakewatch", reason: "Підозра на контрафакт / порушення торгової марки", status: "На розгляді" },
  { id: 2, name: "Схуднення за 3 дні — капсули", seller: "SlimShop", seed: "pillsx", reason: "Медичні твердження без сертифікації", status: "На розгляді" },
  { id: 3, name: "Смарт-годинник Pulse X2", seller: "TechnoHub", seed: "watchx", reason: "Скарга покупця: фото не відповідає товару", status: "На розгляді" },
];

export interface ModerationComment {
  id: number;
  author: string;
  text: string;
  context: string;
  reason: string;
  status: ModerationStatus;
}

export const moderationComments: ModerationComment[] = [
  { id: 1, author: "user_228", text: "Найгірший магазин, всі шахраї, не купуйте!!!", context: "Коментар до відео TechnoHub", reason: "Скарга продавця: наклеп без підтверджень", status: "На розгляді" },
  { id: 2, author: "spam_bot_44", text: "Заробіток 500$ на день, пишіть в телеграм @quickmoney", context: "Коментар до товару Pulse X2", reason: "Автоперевірка: спам/зовнішнє посилання", status: "На розгляді" },
  { id: 3, author: "angry_client", text: "Ідіоти, верніть гроші негайно", context: "Коментар до відео StyleWay", reason: "Скарга: образлива лексика", status: "На розгляді" },
];

export interface AdminReport {
  id: number;
  type: "Товар" | "Продавець" | "Коментар" | "Відео";
  target: string;
  reporter: string;
  reason: string;
  date: string;
  status: ModerationStatus;
}

export const adminReportsList: AdminReport[] = [
  { id: 1, type: "Товар", target: "Годинник \"Rolex\" копія люкс", reporter: "Олена К.", reason: "Контрафакт", date: "сьогодні, 10:20", status: "На розгляді" },
  { id: 2, type: "Продавець", target: "FastDeals24", reporter: "Максим Д.", reason: "Не відповідає на повідомлення 5 днів", date: "вчора", status: "На розгляді" },
  { id: 3, type: "Коментар", target: "user_228", reporter: "TechnoHub", reason: "Наклеп без підтверджень", date: "вчора", status: "На розгляді" },
  { id: 4, type: "Відео", target: "@unknown.trader", reporter: "Ірина В.", reason: "Підозра на шахрайство", date: "2 дні тому", status: "На розгляді" },
  { id: 5, type: "Продавець", target: "SlimShop", reporter: "Адміністрація", reason: "Медичні твердження без сертифікації", date: "3 дні тому", status: "Схвалено" },
];

export interface AdminCategory {
  id: number;
  name: string;
  icon: string;
  products: number;
  visible: boolean;
}

export const adminCategories: AdminCategory[] = [
  { id: 1, name: "Електроніка", icon: "📱", products: 3420, visible: true },
  { id: 2, name: "Мода", icon: "👗", products: 5180, visible: true },
  { id: 3, name: "Краса", icon: "💄", products: 2140, visible: true },
  { id: 4, name: "Дім", icon: "🏠", products: 1860, visible: true },
  { id: 5, name: "Спорт", icon: "⚽", products: 940, visible: true },
  { id: 6, name: "Дитяче", icon: "🧸", products: 720, visible: true },
  { id: 7, name: "Авто", icon: "🚗", products: 410, visible: false },
];

export interface AdminBanner {
  id: number;
  title: string;
  subtitle: string;
  seed: string;
  link: string;
  active: boolean;
  clicks: number;
}

export const adminBanners: AdminBanner[] = [
  { id: 1, title: "Літній розпродаж −40%", subtitle: "Електроніка та гаджети до кінця липня", seed: "bannersummer", link: "/search?cat=Електроніка", active: true, clicks: 18420 },
  { id: 2, title: "TREETEX LIVE щовечора о 19:00", subtitle: "Знижки лише під час прямих ефірів", seed: "bannerlive", link: "/live", active: true, clicks: 24310 },
  { id: 3, title: "Нова колекція StyleWay", subtitle: "Осінньо-весняний одяг вже в каталозі", seed: "bannerstyle", link: "/shop/2", active: false, clicks: 6120 },
];

export interface AdminAd {
  id: number;
  seller: string;
  product: string;
  seed: string;
  budget: string;
  spent: string;
  clicks: number;
  status: "Активна" | "На паузі" | "Завершена";
}

export const adminAds: AdminAd[] = [
  { id: 1, seller: "TechnoHub", product: "Смарт-годинник Pulse X2", seed: "watchx", budget: "10 000 ₴", spent: "6 240 ₴", clicks: 4120, status: "Активна" },
  { id: 2, seller: "GlowUp", product: "Сироватка з вітаміном C", seed: "serumx", budget: "5 000 ₴", spent: "5 000 ₴", clicks: 3860, status: "Завершена" },
  { id: 3, seller: "StyleWay", product: "Кросівки Urban Flow White", seed: "sneakerx", budget: "8 000 ₴", spent: "2 140 ₴", clicks: 1290, status: "На паузі" },
];

export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  updated: string;
  published: boolean;
}

export const cmsPages: CmsPage[] = [
  { id: 1, title: "Про TREETEX", slug: "/about", updated: "2 липня 2026", published: true },
  { id: 2, title: "Умови користування", slug: "/terms", updated: "18 червня 2026", published: true },
  { id: 3, title: "Політика конфіденційності", slug: "/privacy", updated: "18 червня 2026", published: true },
  { id: 4, title: "Правила для продавців", slug: "/seller-rules", updated: "5 травня 2026", published: true },
  { id: 5, title: "Умови акції \"Літо 2026\"", slug: "/promo-summer", updated: "1 липня 2026", published: false },
];

export interface AdminLiveStream {
  id: number;
  title: string;
  seller: string;
  seed: string;
  viewers: string;
  status: "У ефірі" | "Заплановано" | "Завершено";
  scheduled: string;
}

export const adminLiveStreams: AdminLiveStream[] = [
  { id: 1, title: "Розпродаж косметики — знижки до 40%", seller: "GlowUp", seed: "livebeauty", viewers: "2 340", status: "У ефірі", scheduled: "зараз" },
  { id: 2, title: "Нові кросівки сезону: примірка наживо", seller: "StyleWay", seed: "livesneak", viewers: "1 120", status: "У ефірі", scheduled: "зараз" },
  { id: 3, title: "Гаджети тижня: тестуємо в ефірі", seller: "TechnoHub", seed: "livetech", viewers: "0", status: "Заплановано", scheduled: "сьогодні, 19:00" },
  { id: 4, title: "Q&A + знижки для підписників", seller: "TechnoHub", seed: "liveqa", viewers: "1 566", status: "Завершено", scheduled: "17 червня" },
];

export const adminLiveSummary = {
  activeNow: 2,
  scheduledToday: 3,
  totalViewersToday: "8 420",
  ordersFromLive: "612",
};

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  newSellerRegistration: boolean;
  minWithdrawal: string;
}

export const platformSettings: PlatformSettings = {
  platformName: "TREETEX",
  supportEmail: "support@treetex.ua",
  maintenanceMode: false,
  newSellerRegistration: true,
  minWithdrawal: "500 ₴",
};
