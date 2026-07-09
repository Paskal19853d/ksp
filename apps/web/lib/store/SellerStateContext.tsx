"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  sellerOrders,
  sellerProducts,
  sellerCoupons,
  sellerReviews,
  teamMembers,
  type SellerOrder,
  type SellerProduct,
  type SellerCoupon,
  type SellerReview,
  type OrderStatus,
  type ReturnDecision,
  type TeamMember,
  type TeamRole,
} from "@/lib/data/seller";

interface SellerState {
  orders: SellerOrder[];
  products: SellerProduct[];
  coupons: SellerCoupon[];
  reviews: SellerReview[];
  team: TeamMember[];
  theme: "dark" | "light";
  toast: string | null;
  advanceOrder: (no: string) => void;
  toggleProductActive: (id: number) => void;
  saveProduct: (data: { id: number | null; name: string; price: number; stock: number }) => void;
  addCoupon: (code: string, pct: number) => void;
  removeCoupon: (id: number) => void;
  resolveReturn: (no: string, decision: ReturnDecision) => void;
  replyToReview: (id: number, reply: string) => void;
  inviteMember: (email: string, role: TeamRole) => void;
  setMemberRole: (id: number, role: TeamRole) => void;
  removeMember: (id: number) => void;
  toggleTheme: () => void;
  showToast: (msg: string) => void;
}

const nextStatus: Record<OrderStatus, OrderStatus | undefined> = {
  Новий: "Пакується",
  Пакується: "В дорозі",
  "В дорозі": "Доставлено",
  Доставлено: undefined,
  Повернення: undefined,
};

const SellerStateContext = createContext<SellerState | null>(null);

export function SellerStateProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState(sellerOrders);
  const [products, setProducts] = useState(sellerProducts);
  const [coupons, setCoupons] = useState(sellerCoupons);
  const [reviews, setReviews] = useState(sellerReviews);
  const [team, setTeam] = useState(teamMembers);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const advanceOrder = useCallback(
    (no: string) => {
      setOrders((list) =>
        list.map((o) => (o.no === no && nextStatus[o.status] ? { ...o, status: nextStatus[o.status]! } : o))
      );
      const order = orders.find((o) => o.no === no);
      if (order) showToast("Статус оновлено: " + (nextStatus[order.status] ?? order.status));
    },
    [orders, showToast]
  );

  const toggleProductActive = useCallback((id: number) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  }, []);

  const saveProduct = useCallback(
    (data: { id: number | null; name: string; price: number; stock: number }) => {
      if (!data.name.trim() || !data.price) {
        showToast("Вкажіть назву та ціну");
        return;
      }
      if (data.id) {
        setProducts((list) =>
          list.map((p) => (p.id === data.id ? { ...p, name: data.name, price: data.price, stock: data.stock } : p))
        );
        showToast("Зміни збережено ✓");
      } else {
        setProducts((list) => [
          {
            id: Date.now(),
            name: data.name,
            price: data.price,
            stock: data.stock,
            sales: 0,
            cat: "Електроніка",
            sku: "TX-" + Math.floor(1000 + Math.random() * 9000),
            active: true,
            seed: "newprod" + (Date.now() % 97),
          },
          ...list,
        ]);
        showToast("Товар опубліковано ✓");
      }
    },
    [showToast]
  );

  const resolveReturn = useCallback(
    (no: string, decision: ReturnDecision) => {
      setOrders((list) => list.map((o) => (o.no === no ? { ...o, returnDecision: decision } : o)));
      showToast(
        decision === "Схвалено" ? `Повернення ${no} схвалено ✓` : `Повернення ${no} відхилено`
      );
    },
    [showToast]
  );

  const replyToReview = useCallback(
    (id: number, reply: string) => {
      if (!reply.trim()) return;
      setReviews((list) => list.map((r) => (r.id === id ? { ...r, reply: reply.trim() } : r)));
      showToast("Відповідь опубліковано ✓");
    },
    [showToast]
  );

  const addCoupon = useCallback(
    (code: string, pct: number) => {
      if (!code.trim() || !pct || pct < 1 || pct > 90) {
        showToast("Вкажіть код і знижку 1–90%");
        return;
      }
      setCoupons((list) => [...list, { id: Date.now(), code: code.trim().toUpperCase(), pct, until: "7 серпня", used: 0 }]);
      showToast("Купон створено ✓");
    },
    [showToast]
  );

  const removeCoupon = useCallback(
    (id: number) => {
      const coupon = coupons.find((c) => c.id === id);
      setCoupons((list) => list.filter((c) => c.id !== id));
      if (coupon) showToast("Купон " + coupon.code + " зупинено");
    },
    [coupons, showToast]
  );

  const inviteMember = useCallback(
    (email: string, role: TeamRole) => {
      if (!email.trim() || !email.includes("@")) {
        showToast("Вкажіть коректний email");
        return;
      }
      setTeam((list) => [
        ...list,
        {
          id: Date.now(),
          name: email.split("@")[0],
          email: email.trim(),
          role,
          av: 1 + Math.floor(Math.random() * 69),
          joined: "сьогодні",
        },
      ]);
      showToast(`Запрошення надіслано на ${email} ✓`);
    },
    [showToast]
  );

  const setMemberRole = useCallback(
    (id: number, role: TeamRole) => {
      setTeam((list) => list.map((m) => (m.id === id ? { ...m, role } : m)));
      showToast("Роль оновлено ✓");
    },
    [showToast]
  );

  const removeMember = useCallback(
    (id: number) => {
      const member = team.find((m) => m.id === id);
      setTeam((list) => list.filter((m) => m.id !== id));
      if (member) showToast(`${member.name} видалено з команди`);
    },
    [team, showToast]
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <SellerStateContext.Provider
      value={{
        orders,
        products,
        coupons,
        reviews,
        team,
        theme,
        toast,
        advanceOrder,
        toggleProductActive,
        saveProduct,
        addCoupon,
        removeCoupon,
        resolveReturn,
        replyToReview,
        inviteMember,
        setMemberRole,
        removeMember,
        toggleTheme,
        showToast,
      }}
    >
      {children}
    </SellerStateContext.Provider>
  );
}

export function useSellerState() {
  const ctx = useContext(SellerStateContext);
  if (!ctx) throw new Error("useSellerState must be used within SellerStateProvider");
  return ctx;
}
