import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "live" | "discount" | "new" | "success" | "hidden" | "vip" | "premium" | "verified";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  live: "bg-danger text-white animate-pulse2",
  discount: "bg-accent2 text-[#111]",
  new: "bg-accent text-white",
  success: "bg-success text-white",
  hidden: "bg-surface2 text-muted border border-border",
  vip: "bg-gradient-to-br from-accent2 to-[#E8A800] text-[#111]",
  premium: "bg-gradient-to-br from-[#8B5CF6] to-[#5B2CC9] text-white",
  verified: "bg-transparent text-accent",
};

export function Badge({ variant = "new", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-extrabold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function Tag({
  className,
  children,
  onRemove,
}: {
  className?: string;
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface2 px-3.5 py-1.5 text-xs font-bold text-text",
        className
      )}
    >
      {children}
      {onRemove && (
        <button onClick={onRemove} className="cursor-pointer">
          ✕
        </button>
      )}
    </span>
  );
}

export function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-extrabold text-white">
      {count}
    </span>
  );
}
