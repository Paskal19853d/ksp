import { SellerStateProvider } from "@/lib/store/SellerStateContext";
import { SellerShell } from "@/components/seller/SellerShell";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SellerStateProvider>
      <SellerShell>{children}</SellerShell>
    </SellerStateProvider>
  );
}
