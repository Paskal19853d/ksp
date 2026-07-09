import { adminFinanceSummary, adminPayouts } from "@/lib/data/admin";

const statusColors: Record<string, string> = {
  Виплачено: "bg-success text-white",
  "В обробці": "bg-accent2 text-[#111]",
};

export default function AdminFinancePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">GMV платформи</div>
          <div className="mt-1.5 text-2xl font-extrabold">{adminFinanceSummary.gmv}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Дохід платформи</div>
          <div className="mt-1.5 text-2xl font-extrabold text-success">{adminFinanceSummary.platformRevenue}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Очікують виплати</div>
          <div className="mt-1.5 text-2xl font-extrabold text-accent2">{adminFinanceSummary.pendingPayouts}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Середня комісія</div>
          <div className="mt-1.5 text-2xl font-extrabold">{adminFinanceSummary.avgCommission}</div>
        </div>
      </div>

      <div>
        <h2 className="mb-2.5 text-[15px] font-extrabold">Виплати продавцям</h2>
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <div className="flex bg-surface2 px-4.5 py-3 text-[11px] font-extrabold tracking-wider text-muted">
            <span className="flex-[2]">ПРОДАВЕЦЬ</span>
            <span className="flex-1">ДАТА</span>
            <span className="flex-1">СУМА</span>
            <span className="flex-1">КОМІСІЯ</span>
            <span className="flex-1">СТАТУС</span>
          </div>
          {adminPayouts.map((p, i) => (
            <div key={i} className="flex flex-wrap items-center border-t border-border px-4.5 py-3.5 text-[13px] font-bold">
              <span className="flex-[2]">{p.seller}</span>
              <span className="flex-1 text-muted">{p.date}</span>
              <span className="flex-1">{p.sum}</span>
              <span className="flex-1 text-muted">{p.commission}</span>
              <span className="flex-1">
                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${statusColors[p.status]}`}>
                  {p.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
