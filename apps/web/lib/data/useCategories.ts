"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminCategory, Category } from "@treetex/shared";
import { api } from "@/lib/api";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<Category[]>("/categories")
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

export function useAdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get<AdminCategory[]>("/categories/admin")
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    async (data: { name: string; icon: string }) => {
      await api.post("/categories", data);
      await reload();
    },
    [reload]
  );

  const setVisible = useCallback(
    async (id: number, visible: boolean) => {
      setCategories((cur) => cur.map((c) => (c.id === id ? { ...c, visible } : c)));
      await api.patch(`/categories/${id}`, { visible });
    },
    []
  );

  const remove = useCallback(
    async (id: number) => {
      await api.delete(`/categories/${id}`);
      await reload();
    },
    [reload]
  );

  return { categories, loading, create, setVisible, remove, reload };
}
