"use client";

import { useEffect, useState } from "react";
import type { AdminDashboard } from "@treetex/shared";
import { api } from "@/lib/api";

export function useAdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<AdminDashboard>("/admin/dashboard")
      .then(setDashboard)
      .finally(() => setLoading(false));
  }, []);

  return { dashboard, loading };
}

export function formatGmv(amount: number): string {
  if (amount >= 1_000_000) return (amount / 1_000_000).toLocaleString("uk-UA", { maximumFractionDigits: 1 }) + " млн ₴";
  if (amount >= 1_000) return (amount / 1_000).toLocaleString("uk-UA", { maximumFractionDigits: 1 }) + " тис ₴";
  return amount.toLocaleString("uk-UA") + " ₴";
}

export const pendingReportLabels: Record<string, string> = {
  product: "Скарги на товари",
  review: "Скарги на відгуки",
  chat_message: "Скарги на коментарі",
  video: "Скарги на відео",
};
