"use client";

import { useEffect, useState } from "react";
import type { Stream } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";
import { getSocket } from "@/lib/socket";

export function useStream(id: number | null) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id == null) {
      setStream(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get<Stream>(`/streams/${id}`)
      .then(setStream)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Ефір не знайдено"))
      .finally(() => setLoading(false));
  }, [id]);

  return { stream, loading, error };
}

export function useLiveStreams() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<Stream[]>("/streams/live")
      .then(setStreams)
      .finally(() => setLoading(false));
  }, []);

  return { streams, loading };
}

// Joins the stream's WebSocket room for the lifetime of the component, tracks
// the live viewer count, and surfaces per-product stock pushes so a product
// card in the stream sidebar updates without a page refresh.
export function useStreamPresence(streamId: number | null) {
  const [viewerCount, setViewerCount] = useState(0);
  const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});

  useEffect(() => {
    if (streamId == null) return;

    const socket = getSocket();

    function onViewers(data: { streamId: number; count: number }) {
      if (data.streamId === streamId) {
        setViewerCount(data.count);
      }
    }
    function onStock(data: { streamId: number; productId: number; stock: number }) {
      if (data.streamId === streamId) {
        setStockUpdates((cur) => ({ ...cur, [data.productId]: data.stock }));
      }
    }

    socket.on("stream:viewers", onViewers);
    socket.on("stream:product:stock", onStock);
    socket.emit("stream:join", { streamId });

    return () => {
      socket.emit("stream:leave", { streamId });
      socket.off("stream:viewers", onViewers);
      socket.off("stream:product:stock", onStock);
    };
  }, [streamId]);

  return { viewerCount, stockUpdates };
}
