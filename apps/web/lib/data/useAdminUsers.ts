"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminUserListResponse, User, UserRole } from "@treetex/shared";
import { api } from "@/lib/api";

interface UserFilters {
  role?: UserRole;
  search?: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({});

  const reload = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.role) params.set("role", filters.role);
    if (filters.search) params.set("search", filters.search);
    params.set("limit", "100");

    setLoading(true);
    return api
      .get<AdminUserListResponse>(`/users/admin?${params.toString()}`)
      .then((res) => {
        setUsers(res.items);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [filters.role, filters.search]);

  useEffect(() => {
    reload();
  }, [reload]);

  const setBlocked = useCallback(async (id: number, blocked: boolean) => {
    const updated = await api.patch<User>(`/users/admin/${id}/blocked`, { blocked });
    setUsers((cur) => cur.map((u) => (u.id === id ? updated : u)));
    return updated;
  }, []);

  return { users, total, loading, filters, setFilters, setBlocked, reload };
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "buyer":
      return "Покупець";
    case "seller":
      return "Продавець";
    case "blogger":
      return "Блогер";
    case "admin":
      return "Адміністратор";
  }
}
