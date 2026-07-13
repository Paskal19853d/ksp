"use client";

import { useCallback, useEffect, useState } from "react";
import type { Stream } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export function useSellerStreams() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get<Stream[]>("/streams/my")
      .then(setStreams)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити ефіри"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const createStream = useCallback(
    async (input: {
      title: string;
      description?: string;
      videoUrl?: string;
      productIds?: number[];
      scheduledAt?: string;
    }) => {
      await api.post("/streams", input);
      await reload();
    },
    [reload]
  );

  const startStream = useCallback(
    async (id: number) => {
      await api.patch(`/streams/${id}/start`);
      await reload();
    },
    [reload]
  );

  const endStream = useCallback(
    async (id: number) => {
      await api.patch(`/streams/${id}/end`);
      await reload();
    },
    [reload]
  );

  return { streams, loading, error, createStream, startStream, endStream, reload };
}
