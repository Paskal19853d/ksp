"use client";

import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get<Banner[]>("/banners")
      .then(setBanners)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити банери"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const createBanner = useCallback(
    async (input: { title: string; subtitle?: string; imageUrl: string; link: string }) => {
      await api.post("/banners", input);
      await reload();
    },
    [reload]
  );

  const toggleActive = useCallback(
    async (banner: Banner) => {
      await api.patch(`/banners/${banner.id}`, { active: !banner.active });
      await reload();
    },
    [reload]
  );

  const removeBanner = useCallback(
    async (id: number) => {
      await api.delete(`/banners/${id}`);
      await reload();
    },
    [reload]
  );

  return { banners, loading, error, createBanner, toggleActive, removeBanner };
}
