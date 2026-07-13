"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminStream, AdminStreamsSummary } from "@treetex/shared";
import { api } from "@/lib/api";

export function useAdminStreams() {
  const [streams, setStreams] = useState<AdminStream[]>([]);
  const [summary, setSummary] = useState<AdminStreamsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return Promise.all([
      api.get<AdminStream[]>("/streams/admin"),
      api.get<AdminStreamsSummary>("/streams/admin/summary"),
    ])
      .then(([streamsRes, summaryRes]) => {
        setStreams(streamsRes);
        setSummary(summaryRes);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const forceEnd = useCallback(
    async (id: number) => {
      await api.patch(`/streams/${id}/force-end`);
      await reload();
    },
    [reload]
  );

  return { streams, summary, loading, forceEnd, reload };
}

export function streamStatusLabel(status: "scheduled" | "live" | "ended"): string {
  switch (status) {
    case "scheduled":
      return "Заплановано";
    case "live":
      return "У ефірі";
    case "ended":
      return "Завершено";
  }
}

export function streamThumbnailUrl(stream: Pick<AdminStream, "id">, w: number, h: number) {
  return `https://picsum.photos/seed/stream${stream.id}/${w}/${h}`;
}
