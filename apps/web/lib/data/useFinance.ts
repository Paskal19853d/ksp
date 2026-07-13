"use client";

import { useCallback, useEffect, useState } from "react";
import type { CommissionRule, Payout, PlatformFinanceSummary, SellerBalance } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export function useCommissionRules() {
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<CommissionRule[]>("/commissions")
      .then(setRules)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const setRate = useCallback(
    async (categoryId: number, pct: number) => {
      await api.patch(`/commissions/${categoryId}`, { pct });
      await reload();
    },
    [reload]
  );

  return { rules, loading, setRate };
}

export function usePlatformFinanceSummary() {
  const [summary, setSummary] = useState<PlatformFinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<PlatformFinanceSummary>("/finance/summary")
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  return { summary, loading };
}

export function useAllPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<Payout[]>("/payouts")
      .then(setPayouts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const markPaid = useCallback(
    async (id: number) => {
      await api.patch(`/payouts/${id}/paid`);
      await reload();
    },
    [reload]
  );

  return { payouts, loading, markPaid };
}

export function useSellerBalance() {
  const [balance, setBalance] = useState<SellerBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get<SellerBalance>("/seller/balance")
      .then(setBalance)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити баланс"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { balance, loading, error, reload };
}

export function useSellerPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<Payout[]>("/seller/payouts")
      .then(setPayouts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const requestPayout = useCallback(async () => {
    await api.post("/seller/payouts");
    await reload();
  }, [reload]);

  return { payouts, loading, requestPayout, reload };
}
