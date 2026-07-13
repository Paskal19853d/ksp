"use client";

import { useState } from "react";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { useBanners } from "@/lib/data/useBanners";
import { Switch } from "@/components/ui/Switch";
import { ApiError } from "@/lib/api";

export default function AdminBannersPage() {
  const { banners, loading, createBanner, toggleActive, removeBanner } = useBanners();
  const { showToast } = useAdminState();

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");

  async function handleCreate() {
    if (!title.trim() || !imageUrl.trim() || !link.trim()) {
      showToast("Заповніть назву, зображення та посилання");
      return;
    }
    try {
      await createBanner({ title: title.trim(), subtitle: subtitle.trim(), imageUrl: imageUrl.trim(), link: link.trim() });
      showToast("Банер створено ✓");
      setTitle("");
      setSubtitle("");
      setImageUrl("");
      setLink("");
      setCreating(false);
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося створити банер");
    }
  }

  async function handleToggle(banner: (typeof banners)[number]) {
    try {
      await toggleActive(banner);
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося змінити статус");
    }
  }

  async function handleRemove(id: number) {
    try {
      await removeBanner(id);
      showToast("Банер видалено");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося видалити банер");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {!creating ? (
        <button
          onClick={() => setCreating(true)}
          className="rounded-card border border-dashed border-border bg-surface py-3.5 text-sm font-extrabold text-accent hover:border-accent"
        >
          + Новий банер
        </button>
      ) : (
        <div className="rounded-card border border-border bg-surface p-4.5">
          <div className="mb-2.5 text-[15px] font-extrabold">Новий банер</div>
          <div className="flex flex-col gap-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок" className="rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-sm font-semibold outline-none" />
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Підзаголовок" className="rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-sm font-semibold outline-none" />
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="URL зображення" className="rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-sm font-semibold outline-none" />
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Посилання (напр. /search)" className="rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-sm font-semibold outline-none" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleCreate} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-extrabold text-white hover:brightness-110">
              Створити
            </button>
            <button onClick={() => setCreating(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-extrabold hover:border-danger hover:text-danger">
              Скасувати
            </button>
          </div>
        </div>
      )}

      {banners.length === 0 && (
        <div className="py-6 text-center text-[13px] font-semibold text-muted">Банерів ще немає</div>
      )}
      {banners.map((b) => (
        <div key={b.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
          <img src={b.imageUrl} alt={b.title} className="h-[64px] w-[110px] rounded-xl object-cover" />
          <div className="min-w-[200px] flex-[2]">
            <div className="text-[13.5px] font-extrabold">{b.title}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-muted">{b.subtitle}</div>
            <div className="mt-1 text-[11px] font-bold text-accent">{b.link}</div>
          </div>
          <div className="text-[12.5px] font-extrabold">{b.clicks.toLocaleString("uk-UA")} кліків</div>
          <Switch checked={b.active} onChange={() => handleToggle(b)} label={b.active ? "Активний" : "Вимкнено"} />
          <button
            onClick={() => handleRemove(b.id)}
            className="rounded-[10px] border border-border bg-surface2 px-3 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
          >
            Видалити
          </button>
        </div>
      ))}
    </div>
  );
}
