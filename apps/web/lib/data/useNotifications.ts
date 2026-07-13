"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export type NotificationType = "order" | "stream" | "review" | "moderation" | "payout" | "social";

export interface Notification {
  id: number;
  recipientId: number;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<Notification[]>("/notifications")
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const markRead = useCallback(
    async (id: number) => {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((cur) => cur.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    []
  );

  const markAllRead = useCallback(async () => {
    await api.patch("/notifications/read-all");
    setNotifications((cur) => cur.map((n) => ({ ...n, read: true })));
  }, []);

  return { notifications, loading, markRead, markAllRead, reload };
}

export function useUnreadNotificationsCount() {
  const [count, setCount] = useState(0);

  const reload = useCallback(() => {
    return api
      .get<{ count: number }>("/notifications/unread-count")
      .then((res) => setCount(res.count))
      .catch(() => setCount(0));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { count, reload };
}
