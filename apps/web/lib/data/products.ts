export interface MockProduct {
  id: number;
  name: string;
  price: number;
  old: number;
  seed: string;
  rating: number;
  reviews: number;
  badge: string;
  cat: string;
  stock: number;
  seller: string;
}

export const products: MockProduct[] = [
  { id: 1, name: "Бездротові навушники AirSound Pro", price: 2499, old: 3199, seed: "earbudsx", rating: 4.8, reviews: 1243, badge: "−22%", cat: "Електроніка", stock: 14, seller: "TechnoHub" },
  { id: 2, name: "Кросівки Urban Flow White", price: 3890, old: 0, seed: "sneakerx", rating: 4.9, reviews: 867, badge: "Новинка", cat: "Мода", stock: 8, seller: "StyleWay" },
  { id: 3, name: "Смарт-годинник Pulse X2", price: 5490, old: 6990, seed: "watchx", rating: 4.7, reviews: 2109, badge: "−21%", cat: "Електроніка", stock: 23, seller: "TechnoHub" },
  { id: 4, name: "Сироватка з вітаміном C 30 мл", price: 649, old: 0, seed: "serumx", rating: 4.9, reviews: 3312, badge: "Хіт", cat: "Краса", stock: 56, seller: "GlowUp" },
  { id: 5, name: "Худі Oversize Basic Graphite", price: 1290, old: 1590, seed: "hoodiex", rating: 4.6, reviews: 534, badge: "−19%", cat: "Мода", stock: 31, seller: "StyleWay" },
  { id: 6, name: "Портативна колонка BoomGo 20W", price: 1990, old: 0, seed: "speakerx", rating: 4.5, reviews: 412, badge: "", cat: "Електроніка", stock: 19, seller: "TechnoHub" },
  { id: 7, name: "Рюкзак City Pack 25L", price: 1750, old: 0, seed: "backpackx", rating: 4.8, reviews: 698, badge: "", cat: "Мода", stock: 12, seller: "StyleWay" },
  { id: 8, name: "Кавоварка Aroma One", price: 4290, old: 5190, seed: "coffeex", rating: 4.7, reviews: 301, badge: "−17%", cat: "Дім", stock: 6, seller: "HomeLab" },
  { id: 9, name: "Окуляри Retro Wave", price: 890, old: 0, seed: "glassesx", rating: 4.4, reviews: 189, badge: "", cat: "Мода", stock: 44, seller: "StyleWay" },
  { id: 10, name: "Йога-мат EcoGrip 6 мм", price: 720, old: 0, seed: "yogax", rating: 4.8, reviews: 955, badge: "Хіт", cat: "Спорт", stock: 27, seller: "HomeLab" },
];

export interface MockVideo {
  author: string;
  av: number;
  caption: string;
  likes: number;
  comments: number;
  pid: number;
  seed: string;
}

export const videos: MockVideo[] = [
  { author: "@style.way", av: 12, caption: "Худі Oversize — розбираємо якість пошиття та посадку на різні зрости. Тканина щільна, 380 г/м².", likes: 12400, comments: 342, pid: 5, seed: "vidhoodie" },
  { author: "@technohub", av: 33, caption: "Тест AirSound Pro у метро: активне шумозаглушення проти гулу поїзда. Результат вражає.", likes: 45100, comments: 1204, pid: 1, seed: "videarbuds" },
  { author: "@glowup.ua", av: 45, caption: "Ранкова рутина за 5 хвилин: сироватка з вітаміном C до SPF — розказую чому саме так.", likes: 8900, comments: 276, pid: 4, seed: "vidserum" },
];

export const chatPool: [string, string][] = [
  ["Марія", "А є розмір М у наявності?"],
  ["dima_ua", "Взяв дві штуки, дякую за знижку!"],
  ["Оля К.", "Скільки триває доставка до Львова?"],
  ["vlad.web", "Найкращий ефір цього тижня"],
  ["Ірина", "Покажіть ближче, будь ласка"],
  ["maxx", "Промокод ще діє?"],
  ["Соломія", "Замовила! Чекаю на посилку"],
  ["andrii.k", "А буде ще завтра ефір?"],
];

export const comments = [
  { name: "olena.kv", text: "Вже замовила після цього відео, якість топ!", time: "2 год", likes: 214, img: 5 },
  { name: "max_ua", text: "Яка ціна з доставкою до Харкова?", time: "3 год", likes: 48, img: 14 },
  { name: "iryna.s", text: "Носила місяць — жодних нарікань, рекомендую", time: "5 год", likes: 167, img: 25 },
  { name: "d.kovalchuk", text: "Було б круто побачити огляд чорного кольору", time: "8 год", likes: 31, img: 53 },
  { name: "sofia.m", text: "Дякую за чесний огляд без реклами", time: "12 год", likes: 402, img: 32 },
];

export const lives = [
  { title: "Розпродаж косметики — знижки до 40%", host: "GlowUp Beauty", viewers: "2,3K", seed: "livebeauty" },
  { title: "Нові кросівки сезону: примірка наживо", host: "StyleWay", viewers: "1,1K", seed: "livesneak" },
  { title: "Гаджети тижня: тестуємо в ефірі", host: "TechnoHub", viewers: "876", seed: "livetech" },
];

export const reviewCards = [
  { name: "Олена К.", date: "12 червня 2026", stars: "★★★★★", text: "Замовляла під час прямого ефіру зі знижкою. Доставка за день, якість повністю відповідає відео. Дуже задоволена!", img: 5 },
  { name: "Максим Д.", date: "3 червня 2026", stars: "★★★★★", text: "Друга покупка в цього продавця. Упаковка надійна, все як в описі. Рекомендую.", img: 14 },
  { name: "Ірина С.", date: "28 травня 2026", stars: "★★★★☆", text: "Гарна якість за свою ціну, але доставка трохи затрималась.", img: 25 },
];

export const notifs = [
  { id: 1, type: "Замовлення", icon: "🛍", title: "Замовлення відправлено", meta: "TX-284913 · Нова пошта, відділення №42 · буде завтра до 14:00", time: "5 хв тому", unread: true, action: null as string | null },
  { id: 2, type: "Ефіри", icon: "●", title: "GlowUp Beauty розпочала ефір", meta: "Розпродаж косметики — знижки до −40% · 2,3K глядачів", time: "12 хв тому", unread: true, action: "Дивитись" },
  { id: 3, type: "Акції", icon: "%", title: "Ціна знизилась на товар з обраного", meta: "Кросівки Urban Flow White: 3 890 ₴ → 3 490 ₴", time: "1 год тому", unread: true, action: "До товару" },
  { id: 4, type: "Соціальні", icon: "♥", title: "Ваш відгук вподобали 24 людини", meta: "Відгук про AirSound Pro · «Дуже задоволена!»", time: "3 год тому", unread: false, action: null },
  { id: 5, type: "Замовлення", icon: "✓", title: "Нараховано 64 бонуси", meta: "За відгук з фото · бонуси діють 90 днів", time: "вчора", unread: false, action: null },
  { id: 6, type: "Соціальні", icon: "+", title: "StyleWay відповів на ваш коментар", meta: "«Так, унісекс. На 175 см радимо M…»", time: "вчора", unread: false, action: null },
  { id: 7, type: "Ефіри", icon: "◷", title: "Нагадування: ефір TechnoHub о 19:00", meta: "Гаджети тижня · знижка ефіру −30%", time: "вчора", unread: false, action: null },
];

export const orders = [
  { no: "TX-284913", date: "28 червня", sum: "2 499 ₴", status: "Доставлено", seed: "hoodiex" },
  { no: "TX-284702", date: "14 червня", sum: "4 290 ₴", status: "В дорозі", seed: "coffeex" },
  { no: "TX-284102", date: "2 червня", sum: "890 ₴", status: "Скасовано", seed: "glassesx" },
];

export const stories: [string, number][] = [
  ["GlowUp", 45], ["TechnoHub", 33], ["StyleWay", 12], ["HomeLab", 60],
  ["modno.ua", 24], ["kyiv.finds", 15], ["sport.pro", 8],
];

export interface MockShop {
  id: number;
  name: string;
  desc: string;
  av: number;
  followers: string;
}

export const shops: MockShop[] = [
  { id: 1, name: "TechnoHub", desc: "Офіційний продавець електроніки та гаджетів в Україні. Гарантія на всі товари, доставка по всій країні.", av: 33, followers: "48,3K" },
  { id: 2, name: "StyleWay", desc: "Сучасний одяг та аксесуари для міського стилю. Власне виробництво, швидка доставка по Україні.", av: 12, followers: "31,2K" },
  { id: 3, name: "GlowUp", desc: "Косметика та засоби догляду від перевірених брендів. Оригінальна продукція з гарантією якості.", av: 45, followers: "27,9K" },
  { id: 4, name: "HomeLab", desc: "Товари для дому та побуту: від дрібної техніки до аксесуарів для затишку.", av: 60, followers: "19,4K" },
];

export function shopByName(name: string) {
  return shops.find((s) => s.name === name) ?? shops[0];
}

export const categories = ["Все", "Електроніка", "Мода", "Краса", "Дім", "Спорт", "Дитяче", "Авто"];

export function imgUrl(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export function avatarUrl(n: number) {
  return `https://i.pravatar.cc/100?img=${n}`;
}

export function formatPrice(n: number) {
  return n.toLocaleString("uk-UA").replace(/,/g, " ") + " ₴";
}
