"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminSeller, SellerStatus } from "@treetex/shared";
import { api } from "@/lib/api";

export function usePendingSellers() {
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<AdminSeller[]>("/users/admin/sellers/pending")
      .then(setSellers)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const resolve = useCallback(
    async (id: number, status: SellerStatus) => {
      await api.patch(`/users/admin/sellers/${id}/resolve`, { status });
      await reload();
    },
    [reload]
  );

  return { sellers, loading, resolve };
}

export function useAllSellersAdmin() {
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<AdminSeller[]>("/users/admin/sellers")
      .then(setSellers)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const resolve = useCallback(
    async (id: number, status: SellerStatus) => {
      await api.patch(`/users/admin/sellers/${id}/resolve`, { status });
      await reload();
    },
    [reload]
  );

  return { sellers, loading, resolve };
}

export function sellerStatusLabel(status: SellerStatus | null | undefined): string {
  switch (status) {
    case "pending":
      return "На розгляді";
    case "approved":
      return "Схвалено";
    case "rejected":
      return "Відхилено";
    default:
      return "—";
  }
}

export function formatRevenue(amount: number): string {
  return amount.toLocaleString("uk-UA") + " ₴";
}
