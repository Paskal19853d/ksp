"use client";

import { useEffect, useState } from "react";
import type { Product, ProductListResponse } from "@treetex/shared";
import { api, ApiError } from "@/lib/api";

interface UseProductsOptions {
  categoryId?: number;
  search?: string;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categoryId, search, limit } = options;

  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", String(categoryId));
    if (search) params.set("search", search);
    if (limit) params.set("limit", String(limit));

    setLoading(true);
    setError(null);
    api
      .get<ProductListResponse>(`/products?${params.toString()}`)
      .then((res) => setProducts(res.items))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Не вдалося завантажити товари"))
      .finally(() => setLoading(false));
  }, [categoryId, search, limit]);

  return { products, loading, error };
}

export function useMyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<Product[]>("/products/my")
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id == null) {
      setProduct(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get<Product>(`/products/${id}`)
      .then(setProduct)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Товар не знайдено"))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}

export function productImgUrl(product: Pick<Product, "imageSeed">, w: number, h: number) {
  return `https://picsum.photos/seed/${product.imageSeed}/${w}/${h}`;
}

export function productBadge(product: Pick<Product, "compareAtPrice" | "price">) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return undefined;
  const percent = Math.round((1 - product.price / product.compareAtPrice) * 100);
  return `−${percent}%`;
}

export function toCardData(product: Product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.compareAtPrice || undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    badgeLabel: productBadge(product),
    imageUrl: productImgUrl(product, 480, 600),
  };
}
