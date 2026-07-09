import { AdminStateProvider } from "@/lib/store/AdminStateContext";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminStateProvider>
      <AdminShell>{children}</AdminShell>
    </AdminStateProvider>
  );
}
