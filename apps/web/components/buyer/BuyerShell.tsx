"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, BottomNav } from "./BuyerNav";
import { RightPanel } from "./RightPanel";
import { GlobalToast } from "@/lib/store/Toast";
import { useAuth } from "@/lib/store/AuthContext";

const noChromePaths = ["/video", "/live", "/checkout"];

const publicPaths = ["/feed", "/video", "/live", "/search", "/product", "/shop"];

export function BuyerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const fullScreen = noChromePaths.some((p) => pathname?.startsWith(p));
  const showRightPanel = pathname === "/feed";
  const isPublic = publicPaths.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/login");
    }
  }, [loading, user, isPublic, router]);

  if (!isPublic && (loading || !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text">
        <span className="font-display text-lg font-extrabold tracking-wide">TREETEX</span>
      </div>
    );
  }

  if (fullScreen) {
    return (
      <>
        {children}
        <GlobalToast />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg font-sans text-text">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
      {showRightPanel && <RightPanel />}
      <BottomNav />
      <GlobalToast />
    </div>
  );
}
