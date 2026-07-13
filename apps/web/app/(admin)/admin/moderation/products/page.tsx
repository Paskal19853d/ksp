"use client";

import type { Report } from "@treetex/shared";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { usePendingReports } from "@/lib/data/useReports";
import { useProduct, productImgUrl } from "@/lib/data/useProducts";
import { ComingSoon } from "@/components/admin/ComingSoon";
import { ApiError } from "@/lib/api";

function ProductReportRow({ report, onResolve }: { report: Report; onResolve: (status: "approved" | "rejected") => void }) {
  const { product } = useProduct(report.targetId);

  if (!product) return null;

  return (
    <div className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
      <img src={productImgUrl(product, 90, 90)} alt={product.name} className="h-[54px] w-[54px] rounded-xl object-cover" />
      <div className="min-w-[200px] flex-[2]">
        <div className="text-[13.5px] font-extrabold">{product.name}</div>
        <div className="mt-0.5 text-[12.5px] font-semibold text-muted">Продавець: {product.seller?.name}</div>
        <div className="mt-1 text-[11.5px] font-bold text-danger">{report.reason}</div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onResolve("rejected")}
          className="rounded-[10px] bg-success px-3.5 py-2 text-xs font-extrabold text-white hover:brightness-110"
        >
          Відхилити скаргу
        </button>
        <button
          onClick={() => onResolve("approved")}
          className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
        >
          Зняти з публікації
        </button>
      </div>
    </div>
  );
}

export default function AdminModerationProductsPage() {
  const { reports, loading, resolve } = usePendingReports();
  const { showToast } = useAdminState();
  const productReports = reports.filter((r) => r.targetType === "product");

  async function handleResolve(id: number, status: "approved" | "rejected") {
    try {
      await resolve(id, status);
      showToast(status === "approved" ? "Товар знято з публікації" : "Скаргу відхилено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося обробити скаргу");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  if (productReports.length === 0) return <ComingSoon title="Немає товарів на розгляді" />;

  return (
    <div className="flex flex-col gap-2.5">
      {productReports.map((r) => (
        <ProductReportRow key={r.id} report={r} onResolve={(status) => handleResolve(r.id, status)} />
      ))}
    </div>
  );
}
