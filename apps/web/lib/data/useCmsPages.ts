"use client";

import { useCallback, useEffect, useState } from "react";
import type { Page, PageBlock, PageStatus } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export function useCmsPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get<Page[]>("/cms/pages")
      .then(setPages)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити сторінки"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const createPage = useCallback(
    async (input: { title: string; slug: string; status: PageStatus; content: PageBlock[] }) => {
      await api.post("/cms/pages", input);
      await reload();
    },
    [reload]
  );

  const updatePage = useCallback(
    async (id: number, input: Partial<{ title: string; slug: string; status: PageStatus; content: PageBlock[] }>) => {
      await api.patch(`/cms/pages/${id}`, input);
      await reload();
    },
    [reload]
  );

  return { pages, loading, error, createPage, updatePage, reload };
}

export function useCmsPage(id: number | null) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id == null) {
      setPage(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get<Page>(`/cms/pages/${id}`)
      .then(setPage)
      .finally(() => setLoading(false));
  }, [id]);

  return { page, loading };
}

export function usePublicPage(slug: string | null) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug == null) {
      setPage(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get<Page>(`/cms/pages/public/${slug}`)
      .then(setPage)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Сторінку не знайдено"))
      .finally(() => setLoading(false));
  }, [slug]);

  return { page, loading, error };
}
