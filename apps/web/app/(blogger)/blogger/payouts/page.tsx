import { bloggerBalance, bloggerPayouts } from "@/lib/data/blogger";

export default function BloggerPayoutsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="rounded-card bg-accent p-4.5 text-white">
          <div className="text-xs font-bold opacity-80">Доступно до виплати</div>
          <div className="mt-1.5 text-2xl font-extrabold">{bloggerBalance.available}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">В обробці</div>
          <div className="mt-1.5 text-2xl font-extrabold text-accent2">{bloggerBalance.pending}</div>
        </div>
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="text-xs font-bold text-muted">Всього зароблено</div>
          <div className="mt-1.5 text-2xl font-extrabold">{bloggerBalance.totalEarned}</div>
        </div>
      </div>

      <div>
        <h2 className="mb-2.5 text-[15px] font-extrabold">Історія виплат</h2>
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          {bloggerPayouts.map((p, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border px-4.5 py-3.5 last:border-0">
              <div>
                <div className="text-[13px] font-extrabold">{p.date}</div>
                <div className="text-[11.5px] font-semibold text-muted">{p.card}</div>
              </div>
              <span className="text-[13.5px] font-extrabold text-success">{p.sum}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
