"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  adminUsers,
  adminSellers,
  adminCommissions,
  adminCategories,
  moderationVideos,
  moderationProducts,
  moderationComments,
  adminReportsList,
  adminBanners,
  adminAds,
  cmsPages,
  adminLiveStreams,
  platformSettings,
  type AdminUser,
  type AdminSeller,
  type AdminCommissionRule,
  type AdminCategory,
  type ModerationVideo,
  type ModerationProduct,
  type ModerationComment,
  type AdminReport,
  type ModerationStatus,
  type AdminBanner,
  type AdminAd,
  type CmsPage,
  type AdminLiveStream,
  type PlatformSettings,
} from "@/lib/data/admin";

interface AdminState {
  users: AdminUser[];
  sellers: AdminSeller[];
  commissions: AdminCommissionRule[];
  categories: AdminCategory[];
  videos: ModerationVideo[];
  products: ModerationProduct[];
  comments: ModerationComment[];
  reports: AdminReport[];
  banners: AdminBanner[];
  ads: AdminAd[];
  pages: CmsPage[];
  liveStreams: AdminLiveStream[];
  settings: PlatformSettings;
  theme: "dark" | "light";
  toast: string | null;
  toggleUserStatus: (id: number) => void;
  approveSeller: (id: number) => void;
  rejectSeller: (id: number) => void;
  setCommission: (category: string, pct: number) => void;
  toggleCategoryVisible: (id: number) => void;
  resolveVideo: (id: number, status: ModerationStatus) => void;
  resolveProduct: (id: number, status: ModerationStatus) => void;
  resolveComment: (id: number, status: ModerationStatus) => void;
  resolveReport: (id: number, status: ModerationStatus) => void;
  toggleBannerActive: (id: number) => void;
  toggleAdStatus: (id: number) => void;
  togglePagePublished: (id: number) => void;
  stopLiveStream: (id: number) => void;
  updateSettings: (data: Partial<PlatformSettings>) => void;
  toggleTheme: () => void;
  showToast: (msg: string) => void;
}

const AdminStateContext = createContext<AdminState | null>(null);

export function AdminStateProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState(adminUsers);
  const [sellers, setSellers] = useState(adminSellers);
  const [commissions, setCommissions] = useState(adminCommissions);
  const [categories, setCategories] = useState(adminCategories);
  const [videos, setVideos] = useState(moderationVideos);
  const [products, setProducts] = useState(moderationProducts);
  const [comments, setComments] = useState(moderationComments);
  const [reports, setReports] = useState(adminReportsList);
  const [banners, setBanners] = useState(adminBanners);
  const [ads, setAds] = useState(adminAds);
  const [pages, setPages] = useState(cmsPages);
  const [liveStreams, setLiveStreams] = useState(adminLiveStreams);
  const [settings, setSettings] = useState(platformSettings);
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

  const toggleUserStatus = useCallback(
    (id: number) => {
      setUsers((list) =>
        list.map((u) =>
          u.id === id ? { ...u, status: u.status === "Активний" ? "Заблокований" : "Активний" } : u
        )
      );
      const user = users.find((u) => u.id === id);
      if (user) {
        showToast(
          user.status === "Активний" ? `${user.name} заблоковано` : `${user.name} розблоковано ✓`
        );
      }
    },
    [users, showToast]
  );

  const approveSeller = useCallback(
    (id: number) => {
      setSellers((list) => list.map((s) => (s.id === id ? { ...s, status: "Схвалено" } : s)));
      showToast("Продавця схвалено ✓");
    },
    [showToast]
  );

  const rejectSeller = useCallback(
    (id: number) => {
      setSellers((list) => list.map((s) => (s.id === id ? { ...s, status: "Відхилено" } : s)));
      showToast("Заявку відхилено");
    },
    [showToast]
  );

  const setCommission = useCallback(
    (category: string, pct: number) => {
      if (pct < 0 || pct > 50) {
        showToast("Комісія має бути від 0% до 50%");
        return;
      }
      setCommissions((list) => list.map((c) => (c.category === category ? { ...c, pct } : c)));
      showToast(`Комісію для «${category}» оновлено ✓`);
    },
    [showToast]
  );

  const toggleCategoryVisible = useCallback(
    (id: number) => {
      setCategories((list) => list.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));
    },
    []
  );

  const resolveVideo = useCallback(
    (id: number, status: ModerationStatus) => {
      setVideos((list) => list.map((v) => (v.id === id ? { ...v, status } : v)));
      showToast(status === "Схвалено" ? "Відео схвалено ✓" : "Відео відхилено");
    },
    [showToast]
  );

  const resolveProduct = useCallback(
    (id: number, status: ModerationStatus) => {
      setProducts((list) => list.map((p) => (p.id === id ? { ...p, status } : p)));
      showToast(status === "Схвалено" ? "Товар схвалено ✓" : "Товар знято з публікації");
    },
    [showToast]
  );

  const resolveComment = useCallback(
    (id: number, status: ModerationStatus) => {
      setComments((list) => list.map((c) => (c.id === id ? { ...c, status } : c)));
      showToast(status === "Схвалено" ? "Коментар залишено ✓" : "Коментар видалено");
    },
    [showToast]
  );

  const resolveReport = useCallback(
    (id: number, status: ModerationStatus) => {
      setReports((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
      showToast(status === "Схвалено" ? "Скаргу підтверджено ✓" : "Скаргу відхилено");
    },
    [showToast]
  );

  const toggleBannerActive = useCallback((id: number) => {
    setBanners((list) => list.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
  }, []);

  const toggleAdStatus = useCallback(
    (id: number) => {
      setAds((list) =>
        list.map((a) =>
          a.id === id && a.status !== "Завершена"
            ? { ...a, status: a.status === "Активна" ? "На паузі" : "Активна" }
            : a
        )
      );
      showToast("Статус кампанії оновлено");
    },
    [showToast]
  );

  const togglePagePublished = useCallback(
    (id: number) => {
      setPages((list) => list.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
      showToast("Статус сторінки оновлено");
    },
    [showToast]
  );

  const stopLiveStream = useCallback(
    (id: number) => {
      setLiveStreams((list) =>
        list.map((s) => (s.id === id ? { ...s, status: "Завершено", viewers: "0" } : s))
      );
      showToast("Ефір зупинено адміністратором");
    },
    [showToast]
  );

  const updateSettings = useCallback(
    (data: Partial<PlatformSettings>) => {
      setSettings((s) => ({ ...s, ...data }));
      showToast("Налаштування збережено ✓");
    },
    [showToast]
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <AdminStateContext.Provider
      value={{
        users,
        sellers,
        commissions,
        categories,
        videos,
        products,
        comments,
        reports,
        banners,
        ads,
        pages,
        liveStreams,
        settings,
        theme,
        toast,
        toggleUserStatus,
        approveSeller,
        rejectSeller,
        setCommission,
        toggleCategoryVisible,
        resolveVideo,
        resolveProduct,
        resolveComment,
        resolveReport,
        toggleBannerActive,
        toggleAdStatus,
        togglePagePublished,
        stopLiveStream,
        updateSettings,
        toggleTheme,
        showToast,
      }}
    >
      {children}
    </AdminStateContext.Provider>
  );
}

export function useAdminState() {
  const ctx = useContext(AdminStateContext);
  if (!ctx) throw new Error("useAdminState must be used within AdminStateProvider");
  return ctx;
}
