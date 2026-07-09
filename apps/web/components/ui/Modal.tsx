"use client";

import { Button } from "./Button";

export function Modal({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  cancelLabel = "Скасувати",
  confirmLabel = "Видалити",
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] animate-slideUp rounded-[22px] border border-border bg-surface p-6.5 shadow-card"
      >
        <div className="text-[17px] font-extrabold">{title}</div>
        <div className="mt-2 text-[13px] font-semibold leading-normal text-muted">{description}</div>
        <div className="mt-5 flex gap-2.5">
          <Button variant="secondary" className="flex-1 !py-3" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="live" className="flex-1 !py-3" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-10 left-1/2 z-[80] -translate-x-1/2 animate-slideUp whitespace-nowrap rounded-full bg-text px-5.5 py-3 text-[13.5px] font-extrabold text-bg shadow-card">
      {message}
    </div>
  );
}

export function Tooltip({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <span className="absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 animate-slideUp whitespace-nowrap rounded-[9px] bg-text px-3 py-1.5 text-[11.5px] font-bold text-bg">
      {children}
    </span>
  );
}
