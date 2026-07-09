"use client";

import { Toast as ToastUI } from "@/components/ui/Modal";
import { useAppState } from "./AppStateContext";

export function GlobalToast() {
  const { toast } = useAppState();
  return <ToastUI message={toast} />;
}
