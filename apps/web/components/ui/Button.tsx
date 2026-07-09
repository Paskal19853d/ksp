import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "buy" | "secondary" | "ghost" | "live" | "icon" | "pill";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white rounded-2xl px-6 py-3.5 font-extrabold text-sm hover:brightness-110",
  buy: "bg-accent2 text-[#111] rounded-2xl px-6 py-3.5 font-extrabold text-sm hover:brightness-105",
  secondary:
    "bg-surface2 text-text border border-border rounded-2xl px-6 py-3.5 font-extrabold text-sm hover:border-accent",
  ghost:
    "bg-transparent text-accent rounded-2xl px-4 py-3.5 font-extrabold text-sm hover:bg-surface2",
  live: "bg-danger text-white rounded-2xl px-6 py-3.5 font-extrabold text-sm hover:brightness-110",
  icon: "w-[46px] h-[46px] rounded-full bg-surface2 text-text border border-border text-lg hover:border-accent",
  pill: "bg-accent text-white rounded-full px-4.5 py-2.5 font-extrabold text-[12.5px]",
};

export function Button({ variant = "primary", className, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-55 disabled:bg-surface2 disabled:text-muted disabled:border disabled:border-border",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
