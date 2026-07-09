import { BloggerStateProvider } from "@/lib/store/BloggerStateContext";
import { BloggerShell } from "@/components/blogger/BloggerShell";

export default function BloggerLayout({ children }: { children: React.ReactNode }) {
  return (
    <BloggerStateProvider>
      <BloggerShell>{children}</BloggerShell>
    </BloggerStateProvider>
  );
}
