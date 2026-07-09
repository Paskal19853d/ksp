import { Button } from "./Button";
import { Badge } from "./Badge";

export interface LiveCardData {
  id: number;
  title: string;
  host: string;
  viewerCount: string;
  thumbnailUrl: string;
}

export function LiveCard({ stream, onWatch }: { stream: LiveCardData; onWatch?: (id: number) => void }) {
  return (
    <div className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-card transition-transform hover:-translate-y-1">
      <img
        src={stream.thumbnailUrl}
        alt={stream.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/85" />
      <Badge variant="live" className="absolute left-2.5 top-2.5">
        LIVE
      </Badge>
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <div className="text-[12.5px] font-extrabold leading-tight">{stream.title}</div>
        <div className="mt-0.5 text-[11px] font-semibold opacity-80">
          {stream.host} · {stream.viewerCount} глядачів
        </div>
        <Button
          variant="buy"
          className="mt-2 w-full !py-2 !text-[11.5px]"
          onClick={() => onWatch?.(stream.id)}
        >
          Дивитися
        </Button>
      </div>
    </div>
  );
}
