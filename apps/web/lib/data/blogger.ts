export const bloggerDashboardByPeriod: Record<
  string,
  { views: string; clicks: string; conv: string; income: string; bars: number[]; labels: string[] }
> = {
  Сьогодні: { views: "12,4K", clicks: "840", conv: "6,8%", income: "1 240 ₴", bars: [20, 34, 28, 46, 60, 74, 55], labels: ["9", "11", "13", "15", "17", "19", "21"] },
  Тиждень: { views: "84K", clicks: "5 620", conv: "6,4%", income: "8 940 ₴", bars: [40, 58, 44, 72, 66, 90, 78], labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"] },
  Місяць: { views: "340K", clicks: "22,1K", conv: "6,1%", income: "38 600 ₴", bars: [52, 66, 60, 82], labels: ["Т1", "Т2", "Т3", "Т4"] },
};

export const bloggerTopProducts = [
  { name: "Худі Oversize Basic Graphite", seed: "hoodiex", clicks: 3420, pct: 92 },
  { name: "Сироватка з вітаміном C 30 мл", seed: "serumx", clicks: 2180, pct: 61 },
  { name: "Бездротові навушники AirSound Pro", seed: "earbudsx", clicks: 1640, pct: 44 },
];

export interface BloggerLink {
  id: number;
  productName: string;
  seed: string;
  code: string;
  pct: number;
  clicks: number;
  orders: number;
  income: string;
  active: boolean;
}

export const bloggerLinks: BloggerLink[] = [
  { id: 1, productName: "Худі Oversize Basic Graphite", seed: "hoodiex", code: "irina-hoodie", pct: 8, clicks: 3420, orders: 214, income: "18 340 ₴", active: true },
  { id: 2, productName: "Сироватка з вітаміном C 30 мл", seed: "serumx", code: "irina-serum", pct: 12, clicks: 2180, orders: 156, income: "12 100 ₴", active: true },
  { id: 3, productName: "Бездротові навушники AirSound Pro", seed: "earbudsx", code: "irina-buds", pct: 6, clicks: 1640, orders: 88, income: "8 160 ₴", active: true },
  { id: 4, productName: "Йога-мат EcoGrip 6 мм", seed: "yogax", code: "irina-yoga", pct: 10, clicks: 420, orders: 19, income: "1 370 ₴", active: false },
];

export interface BloggerPayout {
  date: string;
  card: string;
  sum: string;
}

export const bloggerPayouts: BloggerPayout[] = [
  { date: "4 липня 2026", card: "Картка •• 7734", sum: "8 940 ₴" },
  { date: "27 червня 2026", card: "Картка •• 7734", sum: "7 620 ₴" },
  { date: "20 червня 2026", card: "Картка •• 7734", sum: "9 180 ₴" },
  { date: "13 червня 2026", card: "Картка •• 7734", sum: "6 340 ₴" },
];

export const bloggerBalance = {
  available: "8 940 ₴",
  pending: "2 310 ₴",
  totalEarned: "186 400 ₴",
};

export type ContentStatus = "Заплановано" | "Опубліковано" | "Чернетка";

export interface ContentItem {
  id: number;
  title: string;
  type: "Відео" | "Ефір" | "Пост";
  date: string;
  status: ContentStatus;
}

export const bloggerContent: ContentItem[] = [
  { id: 1, title: "Огляд худі — зимова колекція", type: "Відео", date: "11 липня, 18:00", status: "Заплановано" },
  { id: 2, title: "Live: розпаковка навушників AirSound", type: "Ефір", date: "13 липня, 19:00", status: "Заплановано" },
  { id: 3, title: "Ранкова рутина зі сироваткою", type: "Відео", date: "1 липня", status: "Опубліковано" },
  { id: 4, title: "Топ-5 товарів місяця", type: "Пост", date: "—", status: "Чернетка" },
];

export interface BloggerVideo {
  id: number;
  caption: string;
  seed: string;
  views: number;
  likes: number;
  comments: number;
  clicks: number;
  orders: number;
}

export const bloggerVideos: BloggerVideo[] = [
  { id: 1, caption: "Худі Oversize — розбираємо якість пошиття та посадку.", seed: "vidhoodie", views: 84200, likes: 12400, comments: 342, clicks: 3420, orders: 214 },
  { id: 2, caption: "Тест AirSound Pro у метро: активне шумозаглушення.", seed: "videarbuds", views: 45100, likes: 8900, comments: 276, clicks: 1640, orders: 88 },
  { id: 3, caption: "Ранкова рутина за 5 хвилин: сироватка з вітаміном C.", seed: "vidserum", views: 62300, likes: 8900, comments: 276, clicks: 2180, orders: 156 },
];

export function bloggerAvatarUrl(n: number) {
  return `https://i.pravatar.cc/100?img=${n}`;
}

export function bloggerImgUrl(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}
