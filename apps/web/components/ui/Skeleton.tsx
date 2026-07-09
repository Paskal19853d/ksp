import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-[linear-gradient(90deg,var(--surface2)_25%,var(--border)_50%,var(--surface2)_75%)] bg-[length:400px_100%]",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex gap-3.5 rounded-card border border-border bg-surface p-5">
      <Skeleton className="h-[100px] w-[84px] flex-none rounded-xl" />
      <div className="flex flex-1 flex-col gap-2.5 pt-1">
        <Skeleton className="h-3.5 w-[85%] rounded-[7px]" />
        <Skeleton className="h-3 w-[55%] rounded-md" />
        <Skeleton className="mt-auto h-[18px] w-[38%] rounded-lg" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "⌕",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-6 text-center">
      <div className="mx-auto mb-2.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-surface2 text-xl">
        {icon}
      </div>
      <div className="text-sm font-extrabold">{title}</div>
      <div className="mt-1 text-xs font-semibold text-muted">{description}</div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-3 cursor-pointer rounded-[10px] border border-border bg-surface2 px-4.5 py-2.5 text-xs font-extrabold text-text"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
