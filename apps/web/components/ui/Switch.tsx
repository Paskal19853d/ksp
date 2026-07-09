import { cn } from "@/lib/cn";

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <div onClick={onChange} className="flex cursor-pointer items-center gap-3">
      <span
        className={cn(
          "relative inline-block h-[26px] w-[44px] flex-none rounded-full border border-border transition-colors",
          checked ? "bg-accent" : "bg-surface2"
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] block h-[18px] w-[18px] rounded-full bg-white transition-all",
            checked ? "left-[21px]" : "left-[3px]"
          )}
        />
      </span>
      {label && <span className="text-[13.5px] font-bold">{label}</span>}
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <div onClick={onChange} className="flex cursor-pointer items-center gap-3">
      <span
        className={cn(
          "flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] border-[1.5px] text-[13px] font-extrabold text-white",
          checked ? "border-accent bg-accent" : "border-border bg-transparent"
        )}
      >
        {checked ? "✓" : ""}
      </span>
      {label && <span className="text-[13.5px] font-bold">{label}</span>}
    </div>
  );
}
