"use client";

import { usePathname } from "next/navigation";
import { Sidebar, BottomNav } from "./BuyerNav";
import { RightPanel } from "./RightPanel";
import { GlobalToast } from "@/lib/store/Toast";

const noChromePaths = ["/video", "/live", "/checkout"];

export function BuyerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullScreen = noChromePaths.some((p) => pathname?.startsWith(p));
  const showRightPanel = pathname === "/feed";

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
