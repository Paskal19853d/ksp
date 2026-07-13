"use client";

import { useState } from "react";
import type { Page, PageBlock } from "@treetex/shared";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { useCmsPages } from "@/lib/data/useCmsPages";
import { Switch } from "@/components/ui/Switch";
import { ApiError } from "@/lib/api";

function emptyBlock(type: PageBlock["type"]): PageBlock {
  if (type === "heading") return { type: "heading", text: "" };
  if (type === "richtext") return { type: "richtext", html: "" };
  return { type: "image", url: "", alt: "" };
}

function BlockEditor({
  block,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: PageBlock;
  onChange: (b: PageBlock) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface2 p-3.5">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="rounded-lg bg-surface px-2.5 py-1 text-[11px] font-extrabold text-muted">
          {block.type === "heading" ? "Заголовок" : block.type === "richtext" ? "Текст" : "Зображення"}
        </span>
        <div className="ml-auto flex gap-1.5">
          <button onClick={onMoveUp} className="rounded-lg border border-border bg-surface px-2 py-1 text-xs font-extrabold hover:border-accent">
            ↑
          </button>
          <button onClick={onMoveDown} className="rounded-lg border border-border bg-surface px-2 py-1 text-xs font-extrabold hover:border-accent">
            ↓
          </button>
          <button onClick={onRemove} className="rounded-lg border border-border bg-surface px-2 py-1 text-xs font-extrabold hover:border-danger hover:text-danger">
            ✕
          </button>
        </div>
      </div>

      {block.type === "heading" && (
        <input
          value={block.text}
          onChange={(e) => onChange({ type: "heading", text: e.target.value })}
          placeholder="Текст заголовка"
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-bold outline-none"
        />
      )}
      {block.type === "richtext" && (
        <textarea
          value={block.html}
          onChange={(e) => onChange({ type: "richtext", html: e.target.value })}
          placeholder="<p>HTML-контент…</p>"
          rows={4}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-mono outline-none"
        />
      )}
      {block.type === "image" && (
        <div className="flex flex-col gap-2">
          <input
            value={block.url}
            onChange={(e) => onChange({ type: "image", url: e.target.value, alt: block.alt })}
            placeholder="URL зображення"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold outline-none"
          />
          <input
            value={block.alt}
            onChange={(e) => onChange({ type: "image", url: block.url, alt: e.target.value })}
            placeholder="Опис (alt)"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold outline-none"
          />
        </div>
      )}
    </div>
  );
}

function PageEditor({ page, onClose }: { page: Page; onClose: () => void }) {
  const { updatePage } = useCmsPages();
  const { showToast } = useAdminState();
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [blocks, setBlocks] = useState<PageBlock[]>(page.content);
  const [saving, setSaving] = useState(false);

  function updateBlock(i: number, next: PageBlock) {
    setBlocks((cur) => cur.map((b, idx) => (idx === i ? next : b)));
  }
  function removeBlock(i: number) {
    setBlocks((cur) => cur.filter((_, idx) => idx !== i));
  }
  function moveBlock(i: number, dir: -1 | 1) {
    setBlocks((cur) => {
      const next = [...cur];
      const j = i + dir;
      if (j < 0 || j >= next.length) return cur;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function addBlock(type: PageBlock["type"]) {
    setBlocks((cur) => [...cur, emptyBlock(type)]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updatePage(page.id, { title, slug, content: blocks });
      showToast("Зміни збережено ✓");
      onClose();
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося зберегти сторінку");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-[640px] flex-col rounded-[22px] border border-border bg-surface p-5.5">
        <div className="mb-3.5 flex items-center gap-2.5">
          <div className="text-[17px] font-extrabold">Редагування сторінки</div>
          <button onClick={onClose} className="ml-auto rounded-full border border-border px-3 py-1.5 text-xs font-extrabold hover:border-danger">
            Закрити
          </button>
        </div>

        <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Назва сторінки"
            className="w-full rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm font-bold outline-none"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug (напр. about)"
            className="w-full rounded-xl border border-border bg-surface2 px-4 py-2.5 text-sm font-semibold outline-none"
          />

          <div className="mt-2 text-[12.5px] font-extrabold text-muted">Блоки контенту</div>
          {blocks.map((block, i) => (
            <BlockEditor
              key={i}
              block={block}
              onChange={(b) => updateBlock(i, b)}
              onRemove={() => removeBlock(i)}
              onMoveUp={() => moveBlock(i, -1)}
              onMoveDown={() => moveBlock(i, 1)}
            />
          ))}

          <div className="flex gap-2">
            <button onClick={() => addBlock("heading")} className="flex-1 rounded-xl border border-dashed border-border py-2 text-xs font-extrabold text-accent hover:border-accent">
              + Заголовок
            </button>
            <button onClick={() => addBlock("richtext")} className="flex-1 rounded-xl border border-dashed border-border py-2 text-xs font-extrabold text-accent hover:border-accent">
              + Текст
            </button>
            <button onClick={() => addBlock("image")} className="flex-1 rounded-xl border border-dashed border-border py-2 text-xs font-extrabold text-accent hover:border-accent">
              + Зображення
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 rounded-xl bg-accent py-3 text-sm font-extrabold text-white hover:brightness-110 disabled:opacity-50"
        >
          {saving ? "Збереження…" : "Зберегти"}
        </button>
      </div>
    </div>
  );
}

export default function AdminCmsPage() {
  const { pages, loading, updatePage, createPage } = useCmsPages();
  const { showToast } = useAdminState();
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  async function handleTogglePublished(page: Page) {
    try {
      await updatePage(page.id, { status: page.status === "published" ? "draft" : "published" });
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося змінити статус");
    }
  }

  async function handleCreate() {
    const slug = `new-page-${Date.now()}`;
    try {
      await createPage({ title: "Нова сторінка", slug, status: "draft", content: [] });
      showToast("Сторінку створено ✓");
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Не вдалося створити сторінку");
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  return (
    <>
      <div className="mb-3.5 flex justify-end">
        <button
          onClick={handleCreate}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-extrabold text-white hover:brightness-110"
        >
          + Нова сторінка
        </button>
      </div>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {pages.length === 0 && (
          <div className="p-6 text-center text-[13px] font-semibold text-muted">Сторінок ще немає</div>
        )}
        {pages.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <div className="min-w-[200px] flex-[2]">
              <div className="text-[13.5px] font-extrabold">{p.title}</div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
                /{p.slug} · оновлено {new Date(p.updatedAt).toLocaleDateString("uk-UA")}
              </div>
            </div>
            <button
              onClick={() => setEditingPage(p)}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
            >
              Редагувати
            </button>
            <Switch
              checked={p.status === "published"}
              onChange={() => handleTogglePublished(p)}
              label={p.status === "published" ? "Опубліковано" : "Чернетка"}
            />
          </div>
        ))}
      </div>

      {editingPage && <PageEditor page={editingPage} onClose={() => setEditingPage(null)} />}
    </>
  );
}
