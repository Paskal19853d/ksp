"use client";

import { useCallback, useEffect, useState } from "react";
import type { Report } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export function usePendingReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get<Report[]>("/reports/pending")
      .then(setReports)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити скарги"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const resolve = useCallback(
    async (id: number, status: "approved" | "rejected") => {
      await api.patch(`/reports/${id}/resolve`, { status });
      await reload();
    },
    [reload]
  );

  return { reports, loading, error, resolve };
}

export function useAllReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<Report[]>("/reports")
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  return { reports, loading };
}
