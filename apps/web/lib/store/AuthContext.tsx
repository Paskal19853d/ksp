"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

export type UserRole = "buyer" | "seller" | "blogger" | "admin";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { name: string; email: string; password: string; role?: "buyer" | "seller" | "blogger" }) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ user: AuthUser }>("/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ user: AuthUser }>("/auth/login", { email, password });
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; password: string; role?: "buyer" | "seller" | "blogger" }) => {
      const res = await api.post<{ user: AuthUser }>("/auth/register", data);
      setUser(res.user);
      return res.user;
    },
    []
  );

  const logout = useCallback(async () => {
    await api.post("/auth/logout").catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };
