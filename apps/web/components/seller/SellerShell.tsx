"use client";

import { usePathname } from "next/navigation";
import { SellerSidebar, SellerMobileNav, sectionTitle } from "./SellerNav";
import { useSellerState } from "@/lib/store/SellerStateContext";
import { Toast } from "@/components/ui/Modal";

export function SellerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme, toast } = useSellerState();

  return (
    <div className="flex min-h-screen bg-bg font-sans text-text">
      <SellerSidebar />
      <main className="min-w-0 flex-1 px-4.5 pb-16">
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 bg-bg py-4.5">
          <h1 className="m-0 text-[21px] font-extrabold">{sectionTitle(pathname)}</h1>
          <span onClick={toggleTheme} className="ml-auto cursor-pointer text-base lg:hidden">
            {theme === "dark" ? "☾" : "☀"}
          </span>
        </div>
        <SellerMobileNav />
        {children}
      </main>
      <Toast message={toast} />
    </div>
  );
}
