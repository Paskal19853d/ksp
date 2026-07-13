"use client";

import { useCallback, useEffect, useState } from "react";
import type { AffiliateLink, AffiliatePayout, BloggerBalance } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export function useAffiliateLinks() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get<AffiliateLink[]>("/blogger/links")
      .then(setLinks)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити посилання"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const createLink = useCallback(
    async (input: { productId: number; code: string; pct: number }) => {
      await api.post("/blogger/links", input);
      await reload();
    },
    [reload]
  );

  const toggleActive = useCallback(
    async (link: AffiliateLink) => {
      await api.patch(`/blogger/links/${link.id}`, { active: !link.active });
      await reload();
    },
    [reload]
  );

  return { links, loading, error, createLink, toggleActive };
}

export function useBloggerBalance() {
  const [balance, setBalance] = useState<BloggerBalance | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<BloggerBalance>("/blogger/balance")
      .then(setBalance)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { balance, loading, reload };
}

export function useBloggerPayouts() {
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<AffiliatePayout[]>("/blogger/payouts")
      .then(setPayouts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const requestPayout = useCallback(async () => {
    await api.post("/blogger/payouts");
    await reload();
  }, [reload]);

  return { payouts, loading, requestPayout, reload };
}
