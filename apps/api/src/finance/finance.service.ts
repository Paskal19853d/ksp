import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DataSource, Repository } from "typeorm";
import { CommissionRuleEntity } from "./entities/commission-rule.entity";
import { PayoutEntity } from "./entities/payout.entity";
import { OrderItemEntity } from "../orders/entities/order-item.entity";
import { CategoriesService } from "../categories/categories.service";
import { UpsertCommissionRuleDto } from "./dto/upsert-commission-rule.dto";

export class PayoutPaidEvent {
  constructor(
    public readonly payoutId: number,
    public readonly sellerId: number,
    public readonly netAmount: number
  ) {}
}

const COMPLETED_STATUSES = ["packing", "shipping", "delivered"];

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(CommissionRuleEntity)
    private readonly commissionRulesRepository: Repository<CommissionRuleEntity>,
    @InjectRepository(PayoutEntity)
    private readonly payoutsRepository: Repository<PayoutEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemsRepository: Repository<OrderItemEntity>,
    private readonly categoriesService: CategoriesService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2
  ) {}

  findAllCommissionRules() {
    return this.commissionRulesRepository.find({ relations: { category: true } });
  }

  async upsertCommissionRule(categoryId: number, dto: UpsertCommissionRuleDto) {
    await this.categoriesService.findOne(categoryId);
    let rule = await this.commissionRulesRepository.findOne({ where: { categoryId } });
    if (rule) {
      rule.pct = dto.pct;
    } else {
      rule = this.commissionRulesRepository.create({ categoryId, pct: dto.pct });
    }
    return this.commissionRulesRepository.save(rule);
  }

  // Unpaid GMV/commission for a seller — items from completed orders that
  // haven't been claimed by any payout yet.
  async getSellerBalance(sellerId: number) {
    const { gmv, commission } = await this.computeUnclaimedTotals(sellerId);
    return { gmv, commission, netAmount: gmv - commission };
  }

  findSellerPayouts(sellerId: number) {
    return this.payoutsRepository.find({
      where: { sellerId },
      order: { createdAt: "DESC" },
    });
  }

  async requestPayout(sellerId: number) {
    return this.dataSource.transaction(async (manager) => {
      const unclaimed = await manager
        .createQueryBuilder(OrderItemEntity, "item")
        .innerJoinAndSelect("item.order", "order")
        .where("item.sellerId = :sellerId", { sellerId })
        .andWhere("item.payoutId IS NULL")
        .andWhere("order.status IN (:...statuses)", { statuses: COMPLETED_STATUSES })
        .getMany();

      if (unclaimed.length === 0) {
        throw new BadRequestException("Немає коштів, доступних до виплати");
      }

      const gmv = unclaimed.reduce((sum, i) => sum + i.price * i.qty, 0);
      const commission = unclaimed.reduce(
        (sum, i) => sum + Math.round((i.price * i.qty * i.commissionPct) / 100),
        0
      );

      const now = new Date();
      const periodStart = unclaimed.reduce(
        (min, i) => (i.order.createdAt < min ? i.order.createdAt : min),
        now
      );

      const payout = manager.create(PayoutEntity, {
        sellerId,
        gmv,
        commission,
        netAmount: gmv - commission,
        periodStart,
        periodEnd: now,
        status: "pending",
      });
      const saved = await manager.save(payout);

      await manager.update(
        OrderItemEntity,
        unclaimed.map((i) => i.id),
        { payoutId: saved.id }
      );

      return saved;
    });
  }

  findAllPayouts() {
    return this.payoutsRepository.find({
      relations: { seller: true },
      select: { seller: { id: true, name: true } },
      order: { createdAt: "DESC" },
    });
  }

  async markPayoutPaid(id: number) {
    const payout = await this.payoutsRepository.findOne({ where: { id } });
    if (!payout) {
      throw new NotFoundException("Виплату не знайдено");
    }
    if (payout.status === "paid") {
      throw new BadRequestException("Виплату вже позначено як виконану");
    }
    payout.status = "paid";
    payout.paidAt = new Date();
    const saved = await this.payoutsRepository.save(payout);
    this.eventEmitter.emit(
      "payout.paid",
      new PayoutPaidEvent(saved.id, saved.sellerId, saved.netAmount)
    );
    return saved;
  }

  async getPlatformSummary() {
    const totals = await this.orderItemsRepository
      .createQueryBuilder("item")
      .innerJoin("item.order", "order")
      .where("order.status IN (:...statuses)", { statuses: COMPLETED_STATUSES })
      .select("SUM(item.price * item.qty)", "gmv")
      .addSelect("SUM(item.price * item.qty * item.commissionPct / 100.0)", "revenue")
      .getRawOne<{ gmv: string | null; revenue: string | null }>();

    const pending = await this.payoutsRepository
      .createQueryBuilder("payout")
      .where("payout.status = :status", { status: "pending" })
      .select("SUM(payout.netAmount)", "pendingPayouts")
      .getRawOne<{ pendingPayouts: string | null }>();

    return {
      gmv: Math.round(Number(totals?.gmv ?? 0)),
      platformRevenue: Math.round(Number(totals?.revenue ?? 0)),
      pendingPayouts: Math.round(Number(pending?.pendingPayouts ?? 0)),
    };
  }

  async getMonthlyGmvTrend(months = 12) {
    const since = new Date();
    since.setMonth(since.getMonth() - (months - 1));
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const rows = await this.orderItemsRepository
      .createQueryBuilder("item")
      .innerJoin("item.order", "order")
      .where("order.status IN (:...statuses)", { statuses: COMPLETED_STATUSES })
      .andWhere("order.createdAt >= :since", { since })
      .select("date_trunc('month', order.createdAt)", "month")
      .addSelect("SUM(item.price * item.qty)", "gmv")
      .groupBy("month")
      .getRawMany<{ month: Date; gmv: string }>();

    const gmvByMonth = new Map<string, number>(
      rows.map((r) => {
        const d = new Date(r.month);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return [key, Number(r.gmv)];
      })
    );

    const bars: number[] = [];
    const labels: string[] = [];
    const cursor = new Date(since);
    for (let i = 0; i < months; i++) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      bars.push(gmvByMonth.get(key) ?? 0);
      labels.push(cursor.toLocaleDateString("uk-UA", { month: "short" }));
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return { bars, labels };
  }

  private async computeUnclaimedTotals(sellerId: number) {
    const raw = await this.orderItemsRepository
      .createQueryBuilder("item")
      .innerJoin("item.order", "order")
      .where("item.sellerId = :sellerId", { sellerId })
      .andWhere("item.payoutId IS NULL")
      .andWhere("order.status IN (:...statuses)", { statuses: COMPLETED_STATUSES })
      .select("SUM(item.price * item.qty)", "gmv")
      .addSelect("SUM(item.price * item.qty * item.commissionPct / 100.0)", "commission")
      .getRawOne<{ gmv: string | null; commission: string | null }>();

    return {
      gmv: Math.round(Number(raw?.gmv ?? 0)),
      commission: Math.round(Number(raw?.commission ?? 0)),
    };
  }
}
