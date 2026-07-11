"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order, OrderStatus } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "Новий",
  packing: "Пакується",
  shipping: "В дорозі",
  delivered: "Доставлено",
  cancelled: "Скасовано",
  return_requested: "Повернення",
};

function useOrdersList(path: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get<Order[]>(path)
      .then(setOrders)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити замовлення"))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { orders, loading, error, reload };
}

export function useMyOrders() {
  return useOrdersList("/orders/my");
}

export function useSellerOrders() {
  return useOrdersList("/orders/seller");
}
