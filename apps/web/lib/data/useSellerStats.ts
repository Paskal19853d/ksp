"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

export type StatsPeriod = "day" | "week" | "month" | "year";

export interface SellerTopProduct {
  productId: number;
  name: string;
  revenue: number;
  unitsSold: number;
  pct: number;
}

export interface SellerStats {
  period: StatsPeriod;
  income: number;
  orderCount: number;
  chart: { labels: string[]; bars: number[] };
  topProducts: SellerTopProduct[];
}

export const periodLabels: Record<StatsPeriod, string> = {
  day: "Сьогодні",
  week: "Тиждень",
  month: "Місяць",
  year: "Рік",
};

export function useSellerStats(period: StatsPeriod) {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get<SellerStats>(`/orders/seller/stats?period=${period}`)
      .then(setStats)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити статистику"))
      .finally(() => setLoading(false));
  }, [period]);

  return { stats, loading, error };
}
