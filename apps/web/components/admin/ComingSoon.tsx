export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border bg-surface py-[90px] text-center">
      <div className="text-[36px]">🚧</div>
      <div className="text-base font-extrabold">{title}</div>
      <div className="text-[13px] font-semibold text-muted">Розділ у розробці</div>
    </div>
  );
}
