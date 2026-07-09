export type OrderStatus = "Новий" | "Пакується" | "В дорозі" | "Доставлено" | "Повернення";

export type ReturnDecision = "На розгляді" | "Схвалено" | "Відхилено";

export interface SellerOrder {
  no: string;
  name: string;
  buyer: string;
  city: string;
  date: string;
  sum: number;
  status: OrderStatus;
  seed: string;
  returnReason?: string;
  returnDecision?: ReturnDecision;
}

export const sellerOrders: SellerOrder[] = [
  { no: "TX-284913", name: "Бездротові навушники AirSound Pro", buyer: "Олена К.", city: "Київ", date: "сьогодні, 11:40", sum: 2499, status: "Новий", seed: "earbudsx" },
  { no: "TX-284907", name: "Смарт-годинник Pulse X2", buyer: "Максим Д.", city: "Львів", date: "сьогодні, 10:15", sum: 5490, status: "Новий", seed: "watchx" },
  { no: "TX-284880", name: "Портативна колонка BoomGo 20W", buyer: "Ірина В.", city: "Одеса", date: "сьогодні, 08:52", sum: 1990, status: "Пакується", seed: "speakerx" },
  { no: "TX-284811", name: "Бездротові навушники AirSound Pro ×2", buyer: "Андрій С.", city: "Дніпро", date: "вчора", sum: 4998, status: "В дорозі", seed: "earbudsx" },
  { no: "TX-284790", name: "Смарт-годинник Pulse X2", buyer: "Соломія Т.", city: "Харків", date: "вчора", sum: 5490, status: "В дорозі", seed: "watchx" },
  { no: "TX-284702", name: "Кавоварка Aroma One", buyer: "Віктор П.", city: "Київ", date: "5 липня", sum: 4290, status: "Доставлено", seed: "coffeex" },
  { no: "TX-284650", name: "Портативна колонка BoomGo 20W", buyer: "Марта Л.", city: "Вінниця", date: "4 липня", sum: 1990, status: "Повернення", seed: "speakerx", returnReason: "Товар пошкоджено при доставці", returnDecision: "На розгляді" },
  { no: "TX-284511", name: "Смарт-годинник Pulse X2", buyer: "Дмитро К.", city: "Полтава", date: "2 липня", sum: 5490, status: "Повернення", seed: "watchx", returnReason: "Не підійшов розмір ремінця", returnDecision: "На розгляді" },
];

export interface SellerProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  sales: number;
  cat: string;
  sku: string;
  active: boolean;
  seed: string;
}

export const sellerProducts: SellerProduct[] = [
  { id: 1, name: "Бездротові навушники AirSound Pro", price: 2499, stock: 14, sales: 1243, cat: "Електроніка", sku: "TX-1001", active: true, seed: "earbudsx" },
  { id: 3, name: "Смарт-годинник Pulse X2", price: 5490, stock: 23, sales: 2109, cat: "Електроніка", sku: "TX-1003", active: true, seed: "watchx" },
  { id: 6, name: "Портативна колонка BoomGo 20W", price: 1990, stock: 19, sales: 412, cat: "Електроніка", sku: "TX-1006", active: true, seed: "speakerx" },
  { id: 8, name: "Кавоварка Aroma One", price: 4290, stock: 6, sales: 301, cat: "Дім", sku: "TX-1008", active: true, seed: "coffeex" },
  { id: 11, name: "Powerbank Volt 20000", price: 1290, stock: 0, sales: 876, cat: "Електроніка", sku: "TX-1011", active: false, seed: "powerx" },
  { id: 12, name: "Веб-камера StreamCam 2K", price: 2190, stock: 31, sales: 154, cat: "Електроніка", sku: "TX-1012", active: true, seed: "camx" },
];

export interface SellerCoupon {
  id: number;
  code: string;
  pct: number;
  until: string;
  used: number;
}

export const sellerCoupons: SellerCoupon[] = [
  { id: 1, code: "TREE10", pct: 10, until: "31 липня", used: 842 },
  { id: 2, code: "LIVE30", pct: 30, until: "лише під час ефірів", used: 2317 },
];

export const dashboardByPeriod: Record<
  string,
  { income: string; orders: string; conv: string; views: string; bars: number[]; labels: string[]; total: string }
> = {
  Сьогодні: { income: "12 480 ₴", orders: "9", conv: "3,4%", views: "8,2K", bars: [18, 32, 26, 44, 58, 71, 52], labels: ["9", "11", "13", "15", "17", "19", "21"], total: "12 480 ₴" },
  Тиждень: { income: "86 340 ₴", orders: "64", conv: "3,1%", views: "54K", bars: [42, 55, 38, 70, 62, 88, 74], labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"], total: "86 340 ₴" },
  Місяць: { income: "380 470 ₴", orders: "291", conv: "2,9%", views: "212K", bars: [50, 64, 58, 80], labels: ["Т1", "Т2", "Т3", "Т4"], total: "380 470 ₴" },
  Рік: { income: "3,42 млн ₴", orders: "2 840", conv: "3,0%", views: "2,1M", bars: [30, 38, 45, 42, 55, 60, 58, 66, 72, 68, 80, 88], labels: ["С", "Л", "Б", "К", "Т", "Ч", "Л", "С", "В", "Ж", "Л", "Г"], total: "3,42 млн ₴" },
};

export const topSellerProducts = [
  { name: "Смарт-годинник Pulse X2", seed: "watchx", pct: 96 },
  { name: "Навушники AirSound Pro", seed: "earbudsx", pct: 78 },
  { name: "Кавоварка Aroma One", seed: "coffeex", pct: 44 },
  { name: "Колонка BoomGo 20W", seed: "speakerx", pct: 31 },
];

export const liveKpis = [
  { label: "Ефірів цього місяця", value: "8", delta: "↑ 2 до червня", up: true },
  { label: "Середні глядачі", value: "1 840", delta: "↑ 31%", up: true },
  { label: "Замовлення з ефірів", value: "426", delta: "38% усіх продажів", up: true },
  { label: "Дохід з ефірів", value: "96 120 ₴", delta: "↑ 44%", up: true },
];

export const liveHistory = [
  { title: "Гаджети тижня #14", date: "1 липня", dur: "1 год 12 хв", viewers: "2 314", orders: "86", income: "21 480 ₴", seed: "livetech" },
  { title: "Розпакування новинок Pulse", date: "24 червня", dur: "54 хв", viewers: "1 902", orders: "71", income: "18 260 ₴", seed: "livewatch" },
  { title: "Q&A + знижки для підписників", date: "17 червня", dur: "1 год 30 хв", viewers: "1 566", orders: "64", income: "15 940 ₴", seed: "liveqa" },
  { title: "Аудіо-спецвипуск", date: "10 червня", dur: "48 хв", viewers: "1 128", orders: "52", income: "12 730 ₴", seed: "liveaudio" },
];

export const payouts = [
  { title: "Автовиплата", date: "4 липня 2026", card: "Картка •• 4921", sum: "74 120 ₴" },
  { title: "Автовиплата", date: "27 червня 2026", card: "Картка •• 4921", sum: "68 450 ₴" },
  { title: "Виплата за запитом", date: "20 червня 2026", card: "Картка •• 4921", sum: "40 000 ₴" },
  { title: "Автовиплата", date: "13 червня 2026", card: "Картка •• 4921", sum: "59 380 ₴" },
];

export const sellerFollowers = [
  { name: "Олена К.", av: 5, since: "з березня 2026", orders: 4 },
  { name: "Максим Д.", av: 14, since: "з квітня 2026", orders: 2 },
  { name: "Ірина В.", av: 25, since: "з травня 2026", orders: 6 },
  { name: "Андрій С.", av: 53, since: "з травня 2026", orders: 1 },
  { name: "Соломія Т.", av: 32, since: "з червня 2026", orders: 3 },
  { name: "Віктор П.", av: 61, since: "з червня 2026", orders: 1 },
];

export interface SellerReview {
  id: number;
  author: string;
  av: number;
  date: string;
  stars: number;
  product: string;
  text: string;
  reply: string | null;
}

export const sellerReviews: SellerReview[] = [
  { id: 1, author: "Олена К.", av: 5, date: "12 червня 2026", stars: 5, product: "Бездротові навушники AirSound Pro", text: "Замовляла під час прямого ефіру зі знижкою. Доставка за день, якість повністю відповідає відео. Дуже задоволена!", reply: "Дякуємо за теплі слова, Олено! ❤" },
  { id: 2, author: "Максим Д.", av: 14, date: "3 червня 2026", stars: 5, product: "Смарт-годинник Pulse X2", text: "Друга покупка в цього продавця. Упаковка надійна, все як в описі. Рекомендую.", reply: null },
  { id: 3, author: "Ірина С.", av: 25, date: "28 травня 2026", stars: 4, product: "Портативна колонка BoomGo 20W", text: "Гарна якість за свою ціну, але доставка трохи затрималась.", reply: null },
  { id: 4, author: "Дмитро К.", av: 53, date: "20 травня 2026", stars: 2, product: "Смарт-годинник Pulse X2", text: "Ремінець виявився вужчим, ніж очікував. Довелось повернути.", reply: null },
];

export const sellerThreads = [
  { name: "Олена К.", av: 5, last: "Відділення №42, Київ. Дякую!", unread: 0 },
  { name: "Максим Д.", av: 14, last: "Чи буде Pulse X2 у чорному…", unread: 1 },
  { name: "Марта Л.", av: 25, last: "Колонка приїхала з подряпиною…", unread: 1 },
  { name: "Андрій С.", av: 53, last: "Дякую за швидку доставку!", unread: 0 },
];

export const sellerMessagesByThread: Record<number, { me: boolean; text: string }[]> = {
  0: [
    { me: false, text: "Добрий день! Замовила навушники, чи можна змінити відділення Нової пошти?" },
    { me: true, text: "Вітаю! Так, звісно — напишіть номер нового відділення, змінимо до відправлення." },
    { me: false, text: "Відділення №42, Київ. Дякую!" },
  ],
  1: [
    { me: false, text: "Чи буде Pulse X2 у чорному кольорі на ефірі сьогодні?" },
    { me: true, text: "Так, покажемо о 19:00 та дамо знижку −30% для глядачів." },
  ],
  2: [
    { me: false, text: "Колонка приїхала з подряпиною, хочу оформити повернення." },
    { me: true, text: "Перепрошуємо! Оформив повернення TX-284650, кошти повернемо протягом 3 днів." },
  ],
  3: [{ me: false, text: "Дякую за швидку доставку, все супер!" }],
};

export const sellerQuickReplies = [
  "Дякуємо за замовлення!",
  "Відправимо сьогодні до 18:00",
  "Так, є в наявності",
  "Оформлюю повернення",
];

export type TeamRole = "Власник" | "Менеджер" | "Оператор" | "Аналітик";

export const teamRolePermissions: Record<TeamRole, string> = {
  Власник: "Повний доступ до всіх розділів і налаштувань",
  Менеджер: "Замовлення, товари, акції та купони",
  Оператор: "Тільки обробка замовлень і чат з покупцями",
  Аналітик: "Тільки перегляд дашборду і фінансової статистики",
};

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: TeamRole;
  av: number;
  joined: string;
}

export const teamMembers: TeamMember[] = [
  { id: 1, name: "Максим Ткаченко", email: "maxim@technohub.ua", role: "Власник", av: 33, joined: "8 січня 2026" },
  { id: 2, name: "Олена Гриценко", email: "olena@technohub.ua", role: "Менеджер", av: 5, joined: "14 лютого 2026" },
  { id: 3, name: "Андрій Поліщук", email: "andrii@technohub.ua", role: "Оператор", av: 53, joined: "3 квітня 2026" },
  { id: 4, name: "Соломія Гнатюк", email: "solomia@technohub.ua", role: "Аналітик", av: 32, joined: "20 травня 2026" },
];

export function fmt(n: number) {
  return n.toLocaleString("uk-UA").replace(/,/g, " ") + " ₴";
}

export function imgUrl(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export function avatarUrl(n: number) {
  return `https://i.pravatar.cc/100?img=${n}`;
}
