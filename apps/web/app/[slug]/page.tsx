"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { PageBlock } from "@treetex/shared";
import { usePublicPage } from "@/lib/data/useCmsPages";

function BlockRenderer({ block }: { block: PageBlock }) {
  if (block.type === "heading") {
    return <h2 className="mt-6 text-xl font-extrabold first:mt-0">{block.text}</h2>;
  }
  if (block.type === "richtext") {
    // html is sanitized server-side (sanitize-html) before it's ever stored —
    // the client renders what the backend already trusted, not raw user input.
    return (
      <div
        className="mt-3 text-[14px] leading-relaxed text-text [&_a]:text-accent [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    );
  }
  return (
    <img
      src={block.url}
      alt={block.alt}
      className="mt-4 w-full rounded-card object-cover"
    />
  );
}

export default function CmsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { page, loading, error } = usePublicPage(params.slug);

  if (loading) {
    return <div className="py-16 text-center text-[13px] font-semibold text-muted">Завантаження…</div>;
  }

  if (error || !page) {
    return (
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-3 px-4 py-24 text-center">
        <div className="text-[15px] font-bold text-muted">Сторінку не знайдено</div>
        <button
          onClick={() => router.push("/feed")}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-white"
        >
          На головну
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 pb-[110px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link
          href="/feed"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
        >
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">{page.title}</h1>
      </div>

      <div className="rounded-card border border-border bg-surface p-5.5">
        {page.content.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </div>
  );
}
