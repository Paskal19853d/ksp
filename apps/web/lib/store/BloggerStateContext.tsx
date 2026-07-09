"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  bloggerLinks,
  bloggerContent,
  type BloggerLink,
  type ContentItem,
  type ContentStatus,
} from "@/lib/data/blogger";

interface BloggerState {
  links: BloggerLink[];
  content: ContentItem[];
  theme: "dark" | "light";
  toast: string | null;
  toggleLinkActive: (id: number) => void;
  createLink: (productName: string, pct: number) => void;
  addContent: (title: string, type: ContentItem["type"], date: string) => void;
  setContentStatus: (id: number, status: ContentStatus) => void;
  toggleTheme: () => void;
  showToast: (msg: string) => void;
}

const BloggerStateContext = createContext<BloggerState | null>(null);

export function BloggerStateProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState(bloggerLinks);
  const [content, setContent] = useState(bloggerContent);
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

  const toggleLinkActive = useCallback((id: number) => {
    setLinks((list) => list.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
  }, []);

  const createLink = useCallback(
    (productName: string, pct: number) => {
      if (!productName.trim() || !pct || pct < 1 || pct > 30) {
        showToast("Вкажіть товар і комісію 1–30%");
        return;
      }
      setLinks((list) => [
        {
          id: Date.now(),
          productName: productName.trim(),
          seed: "newlink" + (Date.now() % 97),
          code: "irina-" + Date.now().toString(36).slice(-5),
          pct,
          clicks: 0,
          orders: 0,
          income: "0 ₴",
          active: true,
        },
        ...list,
      ]);
      showToast("Партнёрське посилання створено ✓");
    },
    [showToast]
  );

  const addContent = useCallback(
    (title: string, type: ContentItem["type"], date: string) => {
      if (!title.trim()) {
        showToast("Вкажіть назву контенту");
        return;
      }
      setContent((list) => [
        { id: Date.now(), title: title.trim(), type, date: date || "—", status: "Чернетка" },
        ...list,
      ]);
      showToast("Додано в календар ✓");
    },
    [showToast]
  );

  const setContentStatus = useCallback(
    (id: number, status: ContentStatus) => {
      setContent((list) => list.map((c) => (c.id === id ? { ...c, status } : c)));
      showToast(`Статус оновлено: ${status}`);
    },
    [showToast]
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <BloggerStateContext.Provider
      value={{
        links,
        content,
        theme,
        toast,
        toggleLinkActive,
        createLink,
        addContent,
        setContentStatus,
        toggleTheme,
        showToast,
      }}
    >
      {children}
    </BloggerStateContext.Provider>
  );
}

export function useBloggerState() {
  const ctx = useContext(BloggerStateContext);
  if (!ctx) throw new Error("useBloggerState must be used within BloggerStateProvider");
  return ctx;
}
