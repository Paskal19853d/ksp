"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

export interface LiveChatMessage {
  id: number | string;
  streamId: number;
  authorId: number;
  authorName?: string;
  text: string;
  sentAt: string;
}

// History (REST, persisted) + live tail (WebSocket, in-memory) merged into one
// list — the component never has to know these come from two different
// transports.
export function useLiveChat(streamId: number | null) {
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);

  useEffect(() => {
    if (streamId == null) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    api
      .get<{ id: number; streamId: number; authorId: number; text: string; createdAt: string }[]>(
        `/streams/${streamId}/chat`
      )
      .then((history) => {
        if (cancelled) return;
        setMessages(
          history.map((m) => ({
            id: m.id,
            streamId: m.streamId,
            authorId: m.authorId,
            text: m.text,
            sentAt: m.createdAt,
          }))
        );
      })
      .catch(() => {
        // No history yet (brand-new stream) is a normal, non-fatal case here.
      });

    const socket = getSocket();
    function onMessage(msg: LiveChatMessage) {
      if (msg.streamId === streamId) {
        setMessages((cur) => [...cur, msg]);
      }
    }
    socket.on("stream:chat:message", onMessage);

    return () => {
      cancelled = true;
      socket.off("stream:chat:message", onMessage);
    };
  }, [streamId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (streamId == null || !text.trim()) return;
      getSocket().emit("stream:chat:send", { streamId, text: text.trim() });
    },
    [streamId]
  );

  return { messages, sendMessage };
}
