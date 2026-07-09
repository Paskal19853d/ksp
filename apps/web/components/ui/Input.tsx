import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  pill?: boolean;
}

export function Input({ error, pill, className, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <input
        className={cn(
          "w-full bg-bg border outline-none px-4 py-3.5 text-[13.5px] font-semibold text-text placeholder:text-muted",
          pill ? "rounded-full" : "rounded-[13px]",
          error ? "border-[1.5px] border-danger" : "border-border",
          className
        )}
        {...props}
      />
      {error && <div className="text-[11.5px] font-bold text-danger">{error}</div>}
    </div>
  );
}
