"use client";

import { usePathname } from "next/navigation";
import { BloggerSidebar, BloggerMobileNav, sectionTitle } from "./BloggerNav";
import { useBloggerState } from "@/lib/store/BloggerStateContext";
import { Toast } from "@/components/ui/Modal";

export function BloggerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme, toast } = useBloggerState();

  return (
    <div className="flex min-h-screen bg-bg font-sans text-text">
      <BloggerSidebar />
      <main className="min-w-0 flex-1 px-4.5 pb-16">
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 bg-bg py-4.5">
          <h1 className="m-0 text-[21px] font-extrabold">{sectionTitle(pathname)}</h1>
          <span onClick={toggleTheme} className="ml-auto cursor-pointer text-base lg:hidden">
            {theme === "dark" ? "☾" : "☀"}
          </span>
        </div>
        <BloggerMobileNav />
        {children}
      </main>
      <Toast message={toast} />
    </div>
  );
}
