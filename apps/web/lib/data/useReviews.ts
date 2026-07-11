"use client";

import { useEffect, useState } from "react";
import type { Review } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

export function useReviews(productId: number | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId == null) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get<Review[]>(`/reviews?productId=${productId}`)
      .then(setReviews)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити відгуки"))
      .finally(() => setLoading(false));
  }, [productId]);

  return { reviews, loading, error };
}
