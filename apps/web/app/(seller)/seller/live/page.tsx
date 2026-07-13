"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSellerState } from "@/lib/store/SellerStateContext";
import { useSellerStreams } from "@/lib/data/useSellerStreams";
import { useMyProducts, productImgUrl } from "@/lib/data/useProducts";
import { ApiError } from "@/lib/api";

const statusLabels: Record<string, string> = {
  scheduled: "Заплановано",
  live: "У прямому ефірі",
  ended: "Завершено",
};

export default function SellerLivePage() {
  const router = useRouter();
  const { showToast } = useSellerState();
  const { streams, loading, createStream, startStream, endStream } = useSellerStreams();
  const { products } = useMyProducts();

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const scheduled = streams.filter((s) => s.status === "scheduled");
  const live = streams.filter((s) => s.status === "live");
  const ended = streams.filter((s) => s.status === "ended");

  function toggleProduct(id: number) {
    setSelectedProductIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  async function handleCreate() {
    if (title.trim().length < 3) {
      showToast("Вкажіть назву ефіру (мінімум 3 символи)");
      return;
    }
    try {
      await createStream({ title: title.trim(), videoUrl: videoUrl.trim() || undefined, productIds: selectedProductIds });
      showToast("Ефір заплановано ✓");
      setTitle("");
      setVideoUrl("");
      setSelectedProductIds([]);
      setCreating(false);
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося створити ефір");
    }
  }

  async function handleStart(id: number) {
    try {
      await startStream(id);
      showToast("Ефір розпочато — глядачі отримали сповіщення");
      router.push(`/live?id=${id}`);
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося розпочати ефір");
    }
  }

  async function handleEnd(id: number) {
    try {
      await endStream(id);
      showToast("Ефір завершено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося завершити ефір");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {live.map((s) => (
        <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-card bg-gradient-to-br from-danger to-[#B00030] p-5.5 text-white">
          <div className="min-w-[220px] flex-1">
            <div className="text-[11px] font-extrabold tracking-wider opacity-80">У ПРЯМОМУ ЕФІРІ</div>
            <div className="mt-1.5 text-[19px] font-extrabold">{s.title}</div>
            <div className="mt-1 text-[12.5px] font-semibold opacity-85">{s.productIds.length} товарів у добірці</div>
          </div>
          <button
            onClick={() => router.push(`/live?id=${s.id}`)}
            className="rounded-2xl bg-white/20 px-5 py-3 text-sm font-extrabold text-white hover:bg-white/30"
          >
            Дивитись
          </button>
          <button
            onClick={() => handleEnd(s.id)}
            className="rounded-2xl bg-white px-6.5 py-3.5 text-sm font-extrabold text-[#B00030] hover:brightness-95"
          >
            ■ Завершити ефір
          </button>
        </div>
      ))}

      {scheduled.map((s) => (
        <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-card border border-border bg-surface p-5.5">
          <div className="min-w-[220px] flex-1">
            <div className="text-[11px] font-extrabold tracking-wider text-muted">ЗАПЛАНОВАНИЙ ЕФІР</div>
            <div className="mt-1.5 text-[19px] font-extrabold">{s.title}</div>
            <div className="mt-1 text-[12.5px] font-semibold text-muted">{s.productIds.length} товарів у добірці</div>
          </div>
          <button
            onClick={() => handleStart(s.id)}
            className="rounded-2xl bg-accent px-6.5 py-3.5 text-sm font-extrabold text-white hover:brightness-110"
          >
            ● Почати ефір
          </button>
        </div>
      ))}

      {!creating ? (
        <button
          onClick={() => setCreating(true)}
          className="rounded-card border border-dashed border-border bg-surface py-4 text-sm font-extrabold text-accent hover:border-accent"
        >
          + Запланувати новий ефір
        </button>
      ) : (
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="mb-3 text-[15px] font-extrabold">Новий ефір</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Назва ефіру"
            className="w-full rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm font-semibold outline-none"
          />
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Посилання на відео (mp4/HLS) — тестове поле, поки нема реальної інтеграції"
            className="mt-2.5 w-full rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm font-semibold outline-none"
          />
          <div className="mt-3.5 text-[12.5px] font-extrabold text-muted">Товари в ефірі</div>
          <div className="mt-2 flex flex-col gap-2 max-h-[260px] overflow-y-auto">
            {products.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border p-2.5 hover:border-accent"
              >
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                />
                <img src={productImgUrl(p, 60, 60)} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />
                <span className="text-[13px] font-semibold">{p.name}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2.5">
            <button
              onClick={handleCreate}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-extrabold text-white hover:brightness-110"
            >
              Запланувати
            </button>
            <button
              onClick={() => setCreating(false)}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-extrabold hover:border-danger hover:text-danger"
            >
              Скасувати
            </button>
          </div>
        </div>
      )}

      <div className="rounded-card border border-border bg-surface p-5">
        <div className="mb-3 text-[15px] font-extrabold">Історія ефірів</div>
        {ended.length === 0 && (
          <div className="py-2 text-[13px] font-semibold text-muted">Завершених ефірів ще немає</div>
        )}
        {ended.map((h) => (
          <div key={h.id} className="flex flex-wrap items-center gap-3.5 border-t border-border py-3">
            <div className="min-w-[170px] flex-[2]">
              <div className="text-[13px] font-extrabold">{h.title}</div>
              <div className="text-[11.5px] font-semibold text-muted">
                {h.endedAt ? new Date(h.endedAt).toLocaleDateString("uk-UA") : ""}
              </div>
            </div>
            <div className="min-w-[100px] flex-1 text-[12.5px] font-bold text-muted">{h.peakViewers} глядачів (пік)</div>
            <div className="min-w-[90px] flex-1 text-[12.5px] font-bold text-muted">{h.ordersCount} замовлень</div>
            <span className="text-sm font-extrabold text-success">{h.income.toLocaleString("uk-UA")} ₴</span>
          </div>
        ))}
      </div>
    </div>
  );
}
