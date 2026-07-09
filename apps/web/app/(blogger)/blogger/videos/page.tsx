import { bloggerVideos, bloggerImgUrl } from "@/lib/data/blogger";

export default function BloggerVideosPage() {
  return (
    <div className="flex flex-col gap-2.5">
      {bloggerVideos.map((v) => (
        <div key={v.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4.5">
          <img src={bloggerImgUrl(v.seed, 90, 130)} alt={v.caption} className="h-[70px] w-[48px] rounded-xl object-cover" />
          <div className="min-w-[200px] flex-[2]">
            <div className="text-[13px] font-semibold leading-snug">{v.caption}</div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 text-[11.5px] font-bold text-muted sm:grid-cols-5">
            <span>{v.views.toLocaleString("uk-UA")} переглядів</span>
            <span>{v.likes.toLocaleString("uk-UA")} лайків</span>
            <span>{v.comments} коментарів</span>
            <span className="text-accent">{v.clicks} кліків</span>
            <span className="text-success">{v.orders} замовлень</span>
          </div>
        </div>
      ))}
    </div>
  );
}
