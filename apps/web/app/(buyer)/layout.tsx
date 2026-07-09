import { AppStateProvider } from "@/lib/store/AppStateContext";
import { BuyerShell } from "@/components/buyer/BuyerShell";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <BuyerShell>{children}</BuyerShell>
    </AppStateProvider>
  );
}
