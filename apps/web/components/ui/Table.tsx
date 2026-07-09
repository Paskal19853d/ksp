import { cn } from "@/lib/cn";

export interface TableRow {
  no: string;
  sum: string;
  status: string;
  statusVariant: "purple" | "warning" | "success";
}

const statusClasses: Record<TableRow["statusVariant"], string> = {
  purple: "bg-[#8B5CF6] text-white",
  warning: "bg-accent2 text-[#111]",
  success: "bg-success text-white",
};

export function OrdersTable({ rows }: { rows: TableRow[] }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="flex bg-surface2 px-4.5 py-3 text-[11px] font-extrabold tracking-wider text-muted">
        <span className="flex-[2]">ЗАМОВЛЕННЯ</span>
        <span className="flex-1">СУМА</span>
        <span className="flex-1">СТАТУС</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.no}
          className="flex items-center border-t border-border px-4.5 py-3.5 text-[13px] font-bold"
        >
          <span className="flex-[2]">{r.no}</span>
          <span className="flex-1">{r.sum}</span>
          <span className="flex-1">
            <span className={cn("rounded-lg px-2.5 py-1 text-[11px] font-extrabold", statusClasses[r.statusVariant])}>
              {r.status}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function NotificationItem({
  icon,
  iconVariant,
  title,
  meta,
  actionLabel,
  onAction,
}: {
  icon: string;
  iconVariant: "accent" | "danger" | "success";
  title: string;
  meta: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const iconBg = { accent: "bg-accent", danger: "bg-danger", success: "bg-success" }[iconVariant];
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5">
      <span
        className={cn(
          "flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl text-[15px] text-white",
          iconBg
        )}
      >
        {icon}
      </span>
      <div className="flex-1">
        <div className="text-[13px] font-extrabold">{title}</div>
        <div className="text-[11.5px] font-semibold text-muted">{meta}</div>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="cursor-pointer rounded-[9px] bg-accent2 px-3.5 py-2 text-[11.5px] font-extrabold text-[#111]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
