export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="mb-2 flex justify-between text-xs font-bold text-muted">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-lg bg-surface2">
        <div className="h-full rounded-lg bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="inline-block h-[26px] w-[26px] animate-spin2 rounded-full border-[3px] border-surface2 border-t-accent" />
      {label && <span className="text-[13px] font-bold text-muted">{label}</span>}
    </div>
  );
}

export function Rating({ value, max = 5, label }: { value: number; max?: number; label?: string }) {
  const full = Math.floor(value);
  return (
    <div className="flex items-baseline gap-1.5 text-lg font-extrabold tracking-[2px] text-accent2">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < full ? "" : "text-surface2"}>
          ★
        </span>
      ))}
      {label && <span className="text-xs font-semibold tracking-normal text-muted">{label}</span>}
    </div>
  );
}
