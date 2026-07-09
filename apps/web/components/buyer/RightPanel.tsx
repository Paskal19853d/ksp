import Link from "next/link";
import { avatarUrl, shops } from "@/lib/data/products";

const topShops = shops.map((s) => ({ id: s.id, name: s.name, meta: `${s.followers} підписників`, av: s.av }));

export function RightPanel() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[300px] flex-none flex-col gap-4.5 overflow-y-auto border-l border-border p-5.5 xl:flex">
      <div className="rounded-card bg-gradient-to-br from-accent to-[#173FA8] p-4.5 text-white">
        <div className="text-[11px] font-extrabold tracking-[.08em] opacity-75">TREETEX LIVE</div>
        <div className="mt-1.5 text-base font-extrabold leading-snug">
          Знижки до −40% лише під час ефіру
        </div>
        <Link
          href="/live"
          className="mt-3 inline-block cursor-pointer rounded-[10px] bg-accent2 px-4 py-2.5 text-[12.5px] font-extrabold text-[#111]"
        >
          Дивитися ефір
        </Link>
      </div>
      <div>
        <div className="mb-2.5 text-sm font-extrabold">Топ магазини</div>
        <div className="flex flex-col gap-2">
          {topShops.map((s) => (
            <Link
              key={s.name}
              href={`/shop/${s.id}`}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 hover:bg-surface"
            >
              <img src={avatarUrl(s.av)} alt={s.name} className="h-[38px] w-[38px] rounded-xl object-cover" />
              <div className="flex-1">
                <div className="text-[13px] font-extrabold">{s.name}</div>
                <div className="text-[11px] font-semibold text-muted">{s.meta}</div>
              </div>
              <span className="text-xs font-extrabold text-accent">✓</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
