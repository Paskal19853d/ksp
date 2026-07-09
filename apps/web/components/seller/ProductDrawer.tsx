"use client";

import { useEffect, useState } from "react";
import { useSellerState } from "@/lib/store/SellerStateContext";
import type { SellerProduct } from "@/lib/data/seller";
import { imgUrl } from "@/lib/data/seller";

const variantOptions = ["S", "M", "L", "XL", "Чорний", "Білий", "Синій"];

export function ProductDrawer({
  open,
  editProduct,
  onClose,
}: {
  open: boolean;
  editProduct: SellerProduct | null;
  onClose: () => void;
}) {
  const { saveProduct } = useSellerState();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [desc, setDesc] = useState("");
  const [variants, setVariants] = useState<string[]>(["S", "M", "L"]);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setPrice(String(editProduct.price));
      setStock(String(editProduct.stock));
      setDesc("Опис товару. Гарантія 12 місяців, офіційне постачання.");
      setPhotos([
        imgUrl(editProduct.seed, 140, 180),
        imgUrl(editProduct.seed + "1", 140, 180),
      ]);
    } else {
      setName("");
      setPrice("");
      setStock("");
      setDesc("");
      setPhotos([]);
    }
  }, [editProduct, open]);

  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.startsWith("blob:")) URL.revokeObjectURL(p);
      });
    };
  }, [photos]);

  if (!open) return null;

  function toggleVariant(v: string) {
    setVariants((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotos((cur) => [...cur, URL.createObjectURL(file)].slice(0, 4));
    e.target.value = "";
  }

  function removePhoto(idx: number) {
    setPhotos((cur) => {
      const photo = cur[idx];
      if (photo?.startsWith("blob:")) URL.revokeObjectURL(photo);
      return cur.filter((_, i) => i !== idx);
    });
  }

  function handleSave() {
    saveProduct({
      id: editProduct?.id ?? null,
      name,
      price: parseInt(price, 10) || 0,
      stock: parseInt(stock, 10) || 0,
    });
    onClose();
  }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[60] bg-black/45" />
      <div className="fixed inset-y-0 right-0 z-[61] w-full animate-slideUp overflow-y-auto border-l border-border bg-bg p-5.5 text-text sm:w-[440px]">
        <div className="mb-4.5 flex items-center justify-between">
          <div className="text-[17px] font-extrabold">{editProduct ? "Редагувати товар" : "Новий товар"}</div>
          <span
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface2"
          >
            ✕
          </span>
        </div>
        <div className="mb-4 flex gap-2">
          {photos.map((src, i) => (
            <div key={src} className="group relative h-[88px] w-[72px] flex-none">
              <div
                className="h-full w-full rounded-xl border border-border bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
              <span
                onClick={() => removePhoto(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-danger text-[11px] font-extrabold text-white"
              >
                ✕
              </span>
            </div>
          ))}
          {photos.length < 4 && (
            <label className="flex h-[88px] w-[72px] flex-none cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-dashed border-border text-[11px] font-extrabold text-muted hover:border-accent hover:text-accent">
              + Фото
              <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
            </label>
          )}
        </div>
        <div className="flex flex-col gap-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Назва товару"
            className="rounded-[13px] border border-border bg-surface px-4 py-3.5 text-[13.5px] font-semibold outline-none"
          />
          <div className="flex gap-2.5">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ціна, ₴"
              className="flex-1 rounded-[13px] border border-border bg-surface px-4 py-3.5 text-[13.5px] font-semibold outline-none"
            />
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Залишок, шт"
              className="flex-1 rounded-[13px] border border-border bg-surface px-4 py-3.5 text-[13.5px] font-semibold outline-none"
            />
          </div>
          <div className="mt-1 text-[12.5px] font-extrabold">Варіації</div>
          <div className="flex flex-wrap gap-1.5">
            {variantOptions.map((v) => (
              <span
                key={v}
                onClick={() => toggleVariant(v)}
                className="cursor-pointer rounded-[10px] border-[1.5px] px-3.5 py-2 text-xs font-bold"
                style={{
                  borderColor: variants.includes(v) ? "var(--accent)" : "var(--border)",
                  background: variants.includes(v) ? "var(--accent)" : "var(--surface2)",
                  color: variants.includes(v) ? "#fff" : "var(--text)",
                }}
              >
                {v}
              </span>
            ))}
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Опис товару…"
            rows={4}
            className="resize-y rounded-[13px] border border-border bg-surface px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed outline-none"
          />
          <button
            onClick={handleSave}
            className="mt-1.5 rounded-2xl bg-accent py-3.5 text-[14.5px] font-extrabold text-white hover:brightness-110"
          >
            {editProduct ? "Зберегти зміни" : "Опублікувати товар"}
          </button>
        </div>
      </div>
    </>
  );
}
