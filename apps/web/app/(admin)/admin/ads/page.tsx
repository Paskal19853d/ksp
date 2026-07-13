"use client";

import { useAdminState } from "@/lib/store/AdminStateContext";
import { useAdCampaigns } from "@/lib/data/useAdCampaigns";
import { productImgUrl } from "@/lib/data/useProducts";
import { ApiError } from "@/lib/api";
import type { AdCampaignStatus } from "@treetex/shared";

const statusLabels: Record<AdCampaignStatus, string> = {
  active: "Активна",
  paused: "На паузі",
  finished: "Завершена",
};

const statusColors: Record<AdCampaignStatus, string> = {
  active: "bg-success text-white",
  paused: "bg-accent2 text-[#111]",
  finished: "bg-surface2 text-muted",
};

export default function AdminAdsPage() {
  const { campaigns, loading, updateStatus } = useAdCampaigns();
  const { showToast } = useAdminState();

  async function handleToggle(id: number, status: AdCampaignStatus) {
    try {
      await updateStatus(id, status === "active" ? "paused" : "active");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося змінити статус кампанії");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      {campaigns.length === 0 && (
        <div className="p-6 text-center text-[13px] font-semibold text-muted">Рекламних кампаній ще немає</div>
      )}
      {campaigns.map((a) => (
        <div key={a.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
          {a.product && (
            <img src={productImgUrl(a.product, 90, 90)} alt={a.product.name} className="h-[54px] w-[54px] rounded-xl object-cover" />
          )}
          <div className="min-w-[180px] flex-[2]">
            <div className="text-[13.5px] font-extrabold">{a.product?.name}</div>
            <div className="text-[11.5px] font-semibold text-muted">{a.seller?.name}</div>
          </div>
          <div className="min-w-[120px] flex-1 text-[12.5px] font-bold">
            {a.spent.toLocaleString("uk-UA")} ₴ <span className="text-muted">/ {a.budget.toLocaleString("uk-UA")} ₴</span>
          </div>
          <div className="min-w-[90px] text-[12.5px] font-extrabold">{a.clicks.toLocaleString("uk-UA")} кліків</div>
          <span className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[a.status]}`}>
            {statusLabels[a.status]}
          </span>
          {a.status !== "finished" && (
            <button
              onClick={() => handleToggle(a.id, a.status)}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
            >
              {a.status === "active" ? "Призупинити" : "Відновити"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
