"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdCampaign, AdCampaignStatus } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export function useAdCampaigns() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get<AdCampaign[]>("/ad-campaigns")
      .then(setCampaigns)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити кампанії"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateStatus = useCallback(
    async (id: number, status: Extract<AdCampaignStatus, "active" | "paused">) => {
      await api.patch(`/ad-campaigns/${id}/status`, { status });
      await reload();
    },
    [reload]
  );

  return { campaigns, loading, error, updateStatus };
}
