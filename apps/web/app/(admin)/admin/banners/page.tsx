"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { imgUrl } from "@/lib/data/products";
import { Switch } from "@/components/ui/Switch";

export default function AdminBannersPage() {
  const { banners, toggleBannerActive } = useAdminState();

  return (
    <div className="flex flex-col gap-2.5">
      {banners.map((b) => (
        <div key={b.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
          <img src={imgUrl(b.seed, 160, 90)} alt={b.title} className="h-[64px] w-[110px] rounded-xl object-cover" />
          <div className="min-w-[200px] flex-[2]">
            <div className="text-[13.5px] font-extrabold">{b.title}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-muted">{b.subtitle}</div>
            <div className="mt-1 text-[11px] font-bold text-accent">{b.link}</div>
          </div>
          <div className="text-[12.5px] font-extrabold">{b.clicks.toLocaleString("uk-UA")} кліків</div>
          <Switch checked={b.active} onChange={() => toggleBannerActive(b.id)} label={b.active ? "Активний" : "Вимкнено"} />
        </div>
      ))}
    </div>
  );
}
