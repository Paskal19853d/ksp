"use client";

import { useCallback, useEffect, useState } from "react";
import type { Video, VideoComment, VideoListResponse } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

interface UseVideoFeedOptions {
  limit?: number;
  offset?: number;
}

export function useVideoFeed(options: UseVideoFeedOptions = {}) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { limit, offset } = options;

  useEffect(() => {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (offset) params.set("offset", String(offset));

    setLoading(true);
    setError(null);
    api
      .get<VideoListResponse>(`/videos?${params.toString()}`)
      .then((res) => setVideos(res.items))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити відео"))
      .finally(() => setLoading(false));
  }, [limit, offset]);

  return { videos, loading, error };
}

export function useMyVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<Video[]>("/videos/my")
      .then(setVideos)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { videos, loading, reload };
}

export function useVideo(id: number | null) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id == null) {
      setVideo(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get<Video>(`/videos/${id}`)
      .then(setVideo)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Відео не знайдено"))
      .finally(() => setLoading(false));
  }, [id]);

  return { video, loading, error };
}

export function useVideoComments(videoId: number | null) {
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    if (videoId == null) {
      setComments([]);
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    return api
      .get<VideoComment[]>(`/videos/${videoId}/comments`)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [videoId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addComment = useCallback(
    async (text: string) => {
      if (videoId == null) return;
      const comment = await api.post<VideoComment>(`/videos/${videoId}/comments`, { text });
      setComments((cur) => [...cur, comment]);
      return comment;
    },
    [videoId]
  );

  return { comments, loading, addComment, reload };
}

export async function toggleVideoLike(videoId: number) {
  return api.post<{ liked: boolean }>(`/videos/${videoId}/like`);
}

export async function registerVideoView(videoId: number) {
  return api.post(`/videos/${videoId}/view`);
}

export async function createVideo(dto: { videoUrl: string; thumbnailUrl?: string; caption?: string; productId?: number }) {
  return api.post<Video>("/videos", dto);
}

export async function deleteVideo(id: number) {
  return api.delete(`/videos/${id}`);
}

export function videoThumbnailUrl(video: Pick<Video, "thumbnailUrl" | "id">, w: number, h: number) {
  if (video.thumbnailUrl) return video.thumbnailUrl;
  return `https://picsum.photos/seed/video${video.id}/${w}/${h}`;
}
