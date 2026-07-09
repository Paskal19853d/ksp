export interface VideoCardData {
  id: number;
  title: string;
  author: string;
  likeCount: string;
  viewCount: string;
  thumbnailUrl: string;
}

export function VideoCard({ video }: { video: VideoCardData }) {
  return (
    <div className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-card transition-transform hover:-translate-y-1">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-black/80" />
      <span className="absolute right-2.5 top-2.5 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-bold text-white">
        ▶ {video.viewCount}
      </span>
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <div className="text-[12.5px] font-extrabold leading-tight">{video.title}</div>
        <div className="mt-0.5 text-[11px] font-semibold opacity-80">
          @{video.author} · ♥ {video.likeCount}
        </div>
      </div>
    </div>
  );
}
