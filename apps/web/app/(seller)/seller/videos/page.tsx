"use client";

import { useRef, useState } from "react";
import { useMyProducts } from "@/lib/data/useProducts";
import { useMyVideos, createVideo, videoThumbnailUrl } from "@/lib/data/useVideos";
import { api, ApiError } from "@/lib/api";
import { useSellerState } from "@/lib/store/SellerStateContext";

async function uploadVideoFile(file: File) {
  const presign = await api.post<{ uploadUrl: string; publicUrl: string }>("/media/presign", {
    kind: "video",
    mimeType: file.type,
    sizeBytes: file.size,
    fileName: file.name,
  });

  const putRes = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error("Не вдалося завантажити файл у сховище");
  }

  return presign.publicUrl;
}

export default function SellerVideosPage() {
  const { videos, loading, reload } = useMyVideos();
  const { products } = useMyProducts();
  const { showToast } = useSellerState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [productId, setProductId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!file) {
      showToast("Оберіть відеофайл");
      return;
    }
    setSubmitting(true);
    try {
      const videoUrl = await uploadVideoFile(file);
      await createVideo({
        videoUrl,
        caption: caption.trim() || undefined,
        productId: productId ? Number(productId) : undefined,
      });
      showToast("Відео опубліковано");
      setFile(null);
      setCaption("");
      setProductId("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await reload();
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося опублікувати відео");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-3 self-start rounded-card border border-border bg-surface p-5">
        <div className="text-[15px] font-extrabold">Завантажити відео</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-surface2 file:px-3 file:py-1.5 file:text-xs file:font-extrabold"
        />
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Підпис до відео"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        >
          <option value="">Без товару</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-xl bg-accent py-3.5 text-[13.5px] font-extrabold text-white hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? "Завантаження…" : "Опублікувати"}
        </button>
        <div className="text-[11.5px] font-semibold leading-relaxed text-muted">
          MP4 або MOV, до 200 МБ. Відео зʼявиться у стрічці одразу після публікації.
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="mb-0.5 text-[15px] font-extrabold">Мої відео</div>
        {loading && <div className="text-[13px] font-semibold text-muted">Завантаження…</div>}
        {!loading && videos.length === 0 && (
          <div className="text-[13px] font-semibold text-muted">Ви ще не завантажили жодного відео</div>
        )}
        {videos.map((v) => (
          <div key={v.id} className="flex items-center gap-3.5 rounded-card border border-border bg-surface p-4">
            <img
              src={videoThumbnailUrl(v, 90, 130)}
              alt={v.caption || "відео"}
              className="h-[70px] w-[48px] rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold">{v.caption || "Без підпису"}</div>
              {v.status === "hidden" && (
                <div className="mt-1 text-[11px] font-extrabold text-danger">Приховано модерацією</div>
              )}
              <div className="mt-1 text-[11.5px] font-bold text-muted">
                {v.viewsCount} переглядів · {v.likesCount} лайків · {v.commentsCount} коментарів
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
