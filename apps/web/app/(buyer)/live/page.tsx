"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/AppStateContext";
import { chatPool, products, imgUrl, avatarUrl, formatPrice } from "@/lib/data/products";

const gifts = [
  { icon: "🌹", name: "Троянда", price: 10 },
  { icon: "💎", name: "Діамант", price: 50 },
  { icon: "🚀", name: "Ракета", price: 100 },
  { icon: "👑", name: "Корона", price: 250 },
  { icon: "🎁", name: "Подарунок", price: 500 },
  { icon: "🏆", name: "Кубок", price: 1000 },
];

const liveProducts = products.slice(0, 3);

let giftIdCounter = 0;

export default function LivePage() {
  const router = useRouter();
  const { addToCart, toggleTheme } = useAppState();
  const [chat, setChat] = useState(() => chatPool.slice(0, 4).map((c, i) => ({ id: i, name: c[0], text: c[1] })));
  const [chatInput, setChatInput] = useState("");
  const [following, setFollowing] = useState(false);
  const [giftPanelOpen, setGiftPanelOpen] = useState(false);
  const [coins] = useState(500);
  const [giftFx, setGiftFx] = useState<{ id: number; icon: string; name: string; sender: string }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const c = chatPool[Math.floor(Math.random() * chatPool.length)];
      setChat((cur) => [...cur, { id: Date.now(), name: c[0], text: c[1] }].slice(-9));
    }, 3200);
    return () => clearInterval(intervalRef.current);
  }, []);

  function sendChat() {
    if (!chatInput.trim()) return;
    setChat((c) => [...c, { id: Date.now(), name: "Ви", text: chatInput }].slice(-9));
    setChatInput("");
  }

  function sendGift(g: (typeof gifts)[number]) {
    const id = ++giftIdCounter;
    setGiftFx((fx) => [...fx, { id, icon: g.icon, name: g.name, sender: "Ви" }]);
    setTimeout(() => setGiftFx((fx) => fx.filter((f) => f.id !== id)), 2600);
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn bg-black">
      <div className="relative min-w-0 flex-1">
        <img src={imgUrl("livebeauty", 900, 1400)} alt="ефір" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 from-0% via-transparent via-45% to-black/85" />

        <div className="absolute inset-x-0 top-0 flex items-center gap-2.5 p-4">
          <button
            onClick={() => router.push("/feed")}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm"
          >
            ✕
          </button>
          <img src={avatarUrl(45)} alt="GlowUp Beauty" className="h-[38px] w-[38px] rounded-full border-2 border-danger object-cover" />
          <div className="min-w-0 text-white">
            <div className="truncate text-[13px] font-extrabold">GlowUp Beauty</div>
            <div className="text-[11px] font-semibold opacity-80">2,3K глядачів</div>
          </div>
          <span className="animate-pulse2 rounded-lg bg-danger px-2.5 py-1 text-[11px] font-extrabold text-white">
            LIVE
          </span>
          <button
            onClick={() => setFollowing((f) => !f)}
            className="rounded-full border border-white/50 px-3 py-1.5 text-xs font-extrabold"
            style={{ background: following ? "transparent" : "#fff", color: following ? "#fff" : "#111" }}
          >
            {following ? "Відстежується" : "Підписатися"}
          </button>
        </div>

        <div className="absolute inset-x-3.5 bottom-3.5 flex flex-col gap-2.5">
          <div className="flex max-h-[200px] flex-col justify-end gap-1.5 overflow-hidden">
            {chat.map((m) => (
              <div
                key={m.id}
                className="animate-slideUp self-start rounded-xl bg-black/45 px-2.5 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur-sm"
                style={{ maxWidth: "85%" }}
              >
                <b className="text-accent2">{m.name}</b> {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Написати в чат…"
              className="flex-1 rounded-full border border-white/20 bg-white/15 px-4 py-2.5 text-[13px] font-semibold text-white outline-none backdrop-blur-sm"
            />
            <button onClick={sendChat} className="h-11 w-11 flex-none rounded-full bg-accent text-base text-white">
              ↑
            </button>
            <button
              onClick={() => setGiftPanelOpen(true)}
              className="h-11 w-11 flex-none rounded-full bg-gradient-to-br from-accent2 to-[#FFAA00] text-lg text-[#111] hover:brightness-105"
            >
              🎁
            </button>
            <button className="h-11 w-11 flex-none rounded-full border border-white/20 bg-white/15 text-base text-white backdrop-blur-sm">
              ♥
            </button>
          </div>
        </div>

        <div className="absolute right-3.5 top-[70px] w-[190px] rounded-2xl border border-white/20 bg-black/55 p-2.5 text-white backdrop-blur-md">
          <div className="mb-1.5 text-[10px] font-extrabold tracking-wider text-accent2">ЗАРАЗ У ЕФІРІ · −30%</div>
          <img src={imgUrl(liveProducts[0].seed, 200, 200)} alt={liveProducts[0].name} className="h-[100px] w-full rounded-[10px] object-cover" />
          <div className="mt-2 text-xs font-bold leading-snug">{liveProducts[0].name}</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[15px] font-extrabold text-accent2">
              {formatPrice(Math.round(liveProducts[0].price * 0.7))}
            </span>
            <span className="text-[11px] opacity-60 line-through">{formatPrice(liveProducts[0].price)}</span>
          </div>
          <div className="mt-0.5 text-[10.5px] font-bold text-danger">Залишилось {liveProducts[0].stock} шт</div>
          <button
            onClick={() => addToCart(liveProducts[0].id)}
            className="mt-2 w-full rounded-[10px] bg-accent py-2 text-xs font-extrabold text-white hover:brightness-110"
          >
            У кошик
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-[230px] left-4.5 z-[4] flex flex-col gap-2.5">
          {giftFx.map((g) => (
            <div key={g.id} className="flex animate-[giftFloat_2.6s_ease-out_forwards] items-center gap-2.5">
              <span className="text-[44px]" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,.5))" }}>
                {g.icon}
              </span>
              <div className="rounded-xl bg-black/55 px-3 py-1.5 text-white backdrop-blur-sm">
                <div className="text-xs font-extrabold">{g.sender}</div>
                <div className="text-[11px] font-bold text-accent2">надсилає {g.name}</div>
              </div>
            </div>
          ))}
        </div>

        {giftPanelOpen && (
          <>
            <div onClick={() => setGiftPanelOpen(false)} className="absolute inset-0 z-[5] bg-black/35" />
            <div className="absolute inset-x-0 bottom-0 z-[6] animate-slideUp rounded-t-[22px] bg-surface p-4.5 pb-5 text-text">
              <div className="mx-auto mb-3 h-1 w-10 rounded bg-border" />
              <div className="mb-3.5 flex items-center gap-2.5">
                <div className="text-[15px] font-extrabold">Подарунки</div>
                <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-surface2 px-3.5 py-1.5">
                  <span>🪙</span>
                  <span className="text-[13.5px] font-extrabold">{coins}</span>
                </div>
                <button className="rounded-full bg-accent px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110">
                  Поповнити
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {gifts.map((g) => (
                  <div
                    key={g.name}
                    onClick={() => sendGift(g)}
                    className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border border-border p-3 hover:-translate-y-0.5 hover:border-accent2"
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <span className="text-[11.5px] font-extrabold">{g.name}</span>
                    <span className="text-[11px] font-extrabold text-accent2">🪙 {g.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3.5 text-center text-[11px] font-semibold text-muted">
                Подарунки підтримують продавця · 70% вартості отримує автор ефіру
              </div>
            </div>
          </>
        )}
      </div>

      <div className="hidden w-[340px] flex-none flex-col border-l border-border bg-surface text-text lg:flex">
        <div className="px-4.5 pb-2.5 pt-4.5 text-[15px] font-extrabold">Товари в ефірі · {liveProducts.length}</div>
        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3.5 pb-3.5">
          {liveProducts.map((p) => (
            <div key={p.id} className="flex gap-3 rounded-2xl border border-border bg-surface2 p-2.5">
              <img src={imgUrl(p.seed, 128, 152)} alt={p.name} className="h-19 w-16 rounded-xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="text-[12.5px] font-bold leading-snug">{p.name}</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-extrabold">{formatPrice(Math.round(p.price * 0.7))}</span>
                  <span className="text-[11px] text-muted line-through">{formatPrice(p.price)}</span>
                  <span className="rounded-md bg-danger px-1.5 py-px text-[10px] font-extrabold text-white">−30%</span>
                </div>
                <div className="mt-0.5 text-[10.5px] font-bold text-danger">Залишилось {p.stock} шт</div>
                <button
                  onClick={() => addToCart(p.id)}
                  className="mt-auto rounded-[9px] bg-accent py-1.5 text-[11.5px] font-extrabold text-white hover:brightness-110"
                >
                  У кошик
                </button>
              </div>
            </div>
          ))}
        </div>
        <div
          onClick={() => router.push("/cart")}
          className="m-3.5 flex cursor-pointer items-center justify-between rounded-2xl bg-accent2 p-3.5 hover:brightness-105"
        >
          <span className="text-[13.5px] font-extrabold text-[#111]">Кошик</span>
          <span className="text-[15px] font-extrabold text-[#111]">→</span>
        </div>
      </div>
    </div>
  );
}
