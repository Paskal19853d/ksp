const taxHistory = [
  { period: "Червень 2026", income: "380 470 ₴", rate: "5%", tax: "19 024 ₴", status: "Сплачено" },
  { period: "Травень 2026", income: "342 110 ₴", rate: "5%", tax: "17 106 ₴", status: "Сплачено" },
  { period: "Квітень 2026", income: "298 640 ₴", rate: "5%", tax: "14 932 ₴", status: "Сплачено" },
  { period: "Липень 2026", income: "86 340 ₴", rate: "5%", tax: "4 317 ₴", status: "Нараховано" },
];

export default function SellerTaxesPage() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">Ставка ФОП 3 групи</div>
          <div className="mt-1 text-2xl font-extrabold">5%</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">До сплати цього кварталу</div>
          <div className="mt-1 text-2xl font-extrabold text-accent2">4 317 ₴</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="text-xs font-bold text-muted">Сплачено за рік</div>
          <div className="mt-1 text-2xl font-extrabold text-success">51 062 ₴</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="grid grid-cols-4 gap-2 border-b border-border px-4.5 py-3 text-[11px] font-extrabold text-muted">
          <span>Період</span>
          <span>Дохід</span>
          <span>Податок</span>
          <span>Статус</span>
        </div>
        {taxHistory.map((t) => (
          <div key={t.period} className="grid grid-cols-4 items-center gap-2 border-b border-border px-4.5 py-3.5 text-[12.5px] font-bold last:border-0">
            <span>{t.period}</span>
            <span className="text-muted">{t.income}</span>
            <span>{t.tax} <span className="text-muted">({t.rate})</span></span>
            <span className={t.status === "Сплачено" ? "text-success" : "text-accent2"}>{t.status}</span>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-dashed border-border bg-surface p-4.5 text-[12.5px] font-semibold leading-relaxed text-muted">
        TREETEX автоматично розраховує податок на основі вашої ставки ФОП. Дані передаються в особистий кабінет
        платника податків для щоквартальної звітності.
      </div>
    </div>
  );
}
