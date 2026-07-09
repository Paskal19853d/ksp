import { Button } from "./Button";

export interface SellerCardData {
  id: number;
  name: string;
  verified?: boolean;
  rating: number;
  followerCount: string;
  productCount: number;
  avatarUrl: string;
}

export function SellerCard({
  seller,
  onFollow,
}: {
  seller: SellerCardData;
  onFollow?: (id: number) => void;
}) {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-2 rounded-card border border-border bg-surface p-4.5 text-center transition-all hover:-translate-y-1 hover:shadow-card">
      <img
        src={seller.avatarUrl}
        alt={seller.name}
        className="h-[68px] w-[68px] rounded-[22px] object-cover"
      />
      <div className="text-[14.5px] font-extrabold">
        {seller.name} {seller.verified && <span className="text-accent text-xs">✓</span>}
      </div>
      <div className="text-[11.5px] font-semibold text-muted">
        ★ {seller.rating.toFixed(1)} · {seller.followerCount} підписників · {seller.productCount} товарів
      </div>
      <Button variant="primary" className="mt-1 w-full !py-2.5 !text-[12.5px]" onClick={() => onFollow?.(seller.id)}>
        Підписатися
      </Button>
    </div>
  );
}
