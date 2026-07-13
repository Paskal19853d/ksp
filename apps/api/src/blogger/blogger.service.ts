import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { AffiliateLinkEntity } from "./entities/affiliate-link.entity";
import { AffiliatePayoutEntity } from "./entities/affiliate-payout.entity";
import { OrderItemEntity } from "../orders/entities/order-item.entity";
import { ProductsService } from "../products/products.service";
import { CreateAffiliateLinkDto } from "./dto/create-affiliate-link.dto";
import { UpdateAffiliateLinkDto } from "./dto/update-affiliate-link.dto";

const COMPLETED_STATUSES = ["packing", "shipping", "delivered"];

@Injectable()
export class BloggerService {
  constructor(
    @InjectRepository(AffiliateLinkEntity)
    private readonly linksRepository: Repository<AffiliateLinkEntity>,
    @InjectRepository(AffiliatePayoutEntity)
    private readonly payoutsRepository: Repository<AffiliatePayoutEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemsRepository: Repository<OrderItemEntity>,
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource
  ) {}

  findMine(bloggerId: number) {
    return this.linksRepository.find({
      where: { bloggerId },
      relations: { product: true },
      order: { createdAt: "DESC" },
    });
  }

  async create(bloggerId: number, dto: CreateAffiliateLinkDto) {
    await this.productsService.findOne(dto.productId);

    const existing = await this.linksRepository.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Код "${dto.code}" вже використовується`);
    }

    const link = this.linksRepository.create({ ...dto, bloggerId });
    return this.linksRepository.save(link);
  }

  async update(id: number, bloggerId: number, dto: UpdateAffiliateLinkDto) {
    const link = await this.findOwnedOrThrow(id, bloggerId);
    Object.assign(link, dto);
    return this.linksRepository.save(link);
  }

  async registerClick(code: string) {
    const result = await this.linksRepository
      .createQueryBuilder()
      .update(AffiliateLinkEntity)
      .set({ clicks: () => '"clicks" + 1' })
      .where("code = :code AND active = true", { code })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException("Партнерське посилання не знайдено або неактивне");
    }
  }

  async getBalance(bloggerId: number) {
    const raw = await this.orderItemsRepository
      .createQueryBuilder("item")
      .innerJoin("item.order", "order")
      .where("item.bloggerId = :bloggerId", { bloggerId })
      .andWhere("item.affiliatePayoutId IS NULL")
      .andWhere("order.status IN (:...statuses)", { statuses: COMPLETED_STATUSES })
      .select("SUM(item.price * item.qty * item.affiliateCommissionPct / 100.0)", "amount")
      .getRawOne<{ amount: string | null }>();

    return { available: Math.round(Number(raw?.amount ?? 0)) };
  }

  findPayouts(bloggerId: number) {
    return this.payoutsRepository.find({
      where: { bloggerId },
      order: { createdAt: "DESC" },
    });
  }

  async requestPayout(bloggerId: number) {
    return this.dataSource.transaction(async (manager) => {
      const unclaimed = await manager
        .createQueryBuilder(OrderItemEntity, "item")
        .innerJoinAndSelect("item.order", "order")
        .where("item.bloggerId = :bloggerId", { bloggerId })
        .andWhere("item.affiliatePayoutId IS NULL")
        .andWhere("order.status IN (:...statuses)", { statuses: COMPLETED_STATUSES })
        .getMany();

      if (unclaimed.length === 0) {
        throw new BadRequestException("Немає коштів, доступних до виплати");
      }

      const amount = unclaimed.reduce(
        (sum, i) => sum + Math.round((i.price * i.qty * (i.affiliateCommissionPct ?? 0)) / 100),
        0
      );

      const now = new Date();
      const periodStart = unclaimed.reduce(
        (min, i) => (i.order.createdAt < min ? i.order.createdAt : min),
        now
      );

      const payout = manager.create(AffiliatePayoutEntity, {
        bloggerId,
        amount,
        periodStart,
        periodEnd: now,
        status: "pending",
      });
      const saved = await manager.save(payout);

      await manager.update(
        OrderItemEntity,
        unclaimed.map((i) => i.id),
        { affiliatePayoutId: saved.id }
      );

      return saved;
    });
  }

  private async findOwnedOrThrow(id: number, bloggerId: number) {
    const link = await this.linksRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException("Посилання не знайдено");
    }
    if (link.bloggerId !== bloggerId) {
      throw new BadRequestException("Це не ваше посилання");
    }
    return link;
  }
}
