"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/AuthContext";

export interface CartItem {
  id: number;
  qty: number;
}

interface ToastState {
  message: string;
}

interface AppState {
  cart: CartItem[];
  favs: number[];
  theme: "dark" | "light";
  toast: string | null;
  addToCart: (id: number) => void;
  incQty: (id: number) => void;
  decQty: (id: number) => void;
  removeFromCart: (id: number) => void;
  toggleFav: (id: number) => void;
  toggleTheme: () => void;
  showToast: (message: string) => void;
  cartCount: number;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([{ id: 1, qty: 1 }, { id: 5, qty: 1 }]);
  const [favs, setFavs] = useState<number[]>([2]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const showToast = useCallback((message: string) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const requireAuth = useCallback(() => {
    if (user) return true;
    router.push("/login");
    return false;
  }, [user, router]);

  const addToCart = useCallback(
    (id: number) => {
      if (!requireAuth()) return;
      setCart((c) => {
        const existing = c.find((i) => i.id === id);
        return existing ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { id, qty: 1 }];
      });
      showToast("Додано в кошик ✓");
    },
    [requireAuth, showToast]
  );

  const incQty = useCallback((id: number) => {
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  }, []);

  const decQty = useCallback((id: number) => {
    setCart((c) => c.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i)));
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((c) => c.filter((i) => i.id !== id));
  }, []);

  const toggleFav = useCallback(
    (id: number) => {
      if (!requireAuth()) return;
      setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    },
    [requireAuth]
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <AppStateContext.Provider
      value={{
        cart,
        favs,
        theme,
        toast,
        addToCart,
        incQty,
        decQty,
        removeFromCart,
        toggleFav,
        toggleTheme,
        showToast,
        cartCount,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
