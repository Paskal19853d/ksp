import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderItemEntity } from "./entities/order-item.entity";
import { StatsPeriod } from "./dto/query-seller-stats.dto";

const COMPLETED_STATUSES = ["packing", "shipping", "delivered"];

interface PeriodConfig {
  since: Date;
  bucket: "hour" | "day" | "week" | "month";
  bucketCount: number;
}

@Injectable()
export class SellerStatsService {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemsRepository: Repository<OrderItemEntity>
  ) {}

  async getStats(sellerId: number, period: StatsPeriod = "week") {
    const config = this.resolvePeriod(period);

    const rows = await this.orderItemsRepository
      .createQueryBuilder("item")
      .innerJoin("item.order", "order")
      .where("item.sellerId = :sellerId", { sellerId })
      .andWhere("order.status IN (:...statuses)", { statuses: COMPLETED_STATUSES })
      .andWhere("order.createdAt >= :since", { since: config.since })
      .select("item.productId", "productId")
      .addSelect("item.productName", "productName")
      .addSelect("item.price", "price")
      .addSelect("item.qty", "qty")
      .addSelect("order.createdAt", "createdAt")
      .addSelect("order.id", "orderId")
      .getRawMany<{
        productId: number;
        productName: string;
        price: number;
        qty: number;
        createdAt: Date;
        orderId: number;
      }>();

    const income = rows.reduce((sum, r) => sum + r.price * r.qty, 0);
    const orderCount = new Set(rows.map((r) => r.orderId)).size;

    const buckets = this.bucketize(rows, config);

    const productTotals = new Map<number, { name: string; revenue: number; qty: number }>();
    for (const r of rows) {
      const entry = productTotals.get(r.productId) ?? { name: r.productName, revenue: 0, qty: 0 };
      entry.revenue += r.price * r.qty;
      entry.qty += r.qty;
      productTotals.set(r.productId, entry);
    }
    const topProducts = [...productTotals.entries()]
      .map(([productId, v]) => ({ productId, name: v.name, revenue: v.revenue, unitsSold: v.qty }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    const maxRevenue = topProducts[0]?.revenue ?? 0;

    return {
      period,
      income,
      orderCount,
      chart: { labels: buckets.labels, bars: buckets.bars },
      topProducts: topProducts.map((p) => ({
        ...p,
        pct: maxRevenue > 0 ? Math.round((p.revenue / maxRevenue) * 100) : 0,
      })),
    };
  }

  private resolvePeriod(period: StatsPeriod): PeriodConfig {
    const now = new Date();
    switch (period) {
      case "day":
        return { since: new Date(now.getTime() - 24 * 3600_000), bucket: "hour", bucketCount: 24 };
      case "month":
        return { since: new Date(now.getTime() - 30 * 24 * 3600_000), bucket: "week", bucketCount: 4 };
      case "year":
        return { since: new Date(now.getTime() - 365 * 24 * 3600_000), bucket: "month", bucketCount: 12 };
      case "week":
      default:
        return { since: new Date(now.getTime() - 7 * 24 * 3600_000), bucket: "day", bucketCount: 7 };
    }
  }

  private bucketize(
    rows: { price: number; qty: number; createdAt: Date }[],
    config: PeriodConfig
  ) {
    const now = new Date();
    const bars = new Array(config.bucketCount).fill(0);
    const labels: string[] = [];

    for (const row of rows) {
      const idx = this.bucketIndex(new Date(row.createdAt), now, config);
      if (idx >= 0 && idx < config.bucketCount) {
        bars[idx] += row.price * row.qty;
      }
    }

    for (let i = config.bucketCount - 1; i >= 0; i--) {
      labels.push(this.labelFor(now, i, config));
    }

    return { bars, labels };
  }

  private bucketIndex(date: Date, now: Date, config: PeriodConfig): number {
    const msPerUnit =
      config.bucket === "hour"
        ? 3600_000
        : config.bucket === "day"
          ? 24 * 3600_000
          : config.bucket === "week"
            ? 7 * 24 * 3600_000
            : 30 * 24 * 3600_000;
    const diff = Math.floor((now.getTime() - date.getTime()) / msPerUnit);
    return config.bucketCount - 1 - diff;
  }

  private labelFor(now: Date, stepsAgo: number, config: PeriodConfig): string {
    const d = new Date(now);
    if (config.bucket === "hour") d.setHours(d.getHours() - stepsAgo);
    else if (config.bucket === "day") d.setDate(d.getDate() - stepsAgo);
    else if (config.bucket === "week") d.setDate(d.getDate() - stepsAgo * 7);
    else d.setMonth(d.getMonth() - stepsAgo);

    if (config.bucket === "hour") return `${d.getHours()}:00`;
    if (config.bucket === "month") return d.toLocaleDateString("uk-UA", { month: "short" });
    return d.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
  }
}
