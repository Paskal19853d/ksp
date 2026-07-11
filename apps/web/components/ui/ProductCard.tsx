import { Button } from "./Button";
import { Badge } from "./Badge";

export interface ProductCardData {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviewCount?: number;
  badgeLabel?: string;
  imageUrl: string;
}

export function ProductCard({
  product,
  onAddToCart,
}: {
  product: ProductCardData;
  onAddToCart?: (id: number) => void;
}) {
  return (
    <div className="cursor-pointer overflow-hidden rounded-card border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-card">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="block aspect-[4/5] w-full object-cover"
        />
        {product.badgeLabel && (
          <Badge variant="discount" className="absolute left-2.5 top-2.5">
            {product.badgeLabel}
          </Badge>
        )}
      </div>
      <div className="p-3.5 pb-4">
        <div className="text-[13px] font-bold">{product.name}</div>
        {product.rating !== undefined && (
          <div className="mt-1 text-[11.5px] font-semibold text-muted">
            ★ {product.rating.toFixed(1)} · {product.reviewCount?.toLocaleString("uk-UA")} відгуків
          </div>
        )}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-base font-extrabold">{product.price.toLocaleString("uk-UA")} ₴</span>
          {product.oldPrice && (
            <span className="text-xs text-muted line-through">
              {product.oldPrice.toLocaleString("uk-UA")} ₴
            </span>
          )}
        </div>
        <Button
          variant="primary"
          className="mt-2.5 w-full !px-0 !py-2.5"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product.id);
          }}
        >
          У кошик
        </Button>
      </div>
    </div>
  );
}
