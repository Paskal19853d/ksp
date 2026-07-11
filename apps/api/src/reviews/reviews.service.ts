import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ReviewEntity } from "./entities/review.entity";
import { OrderItemEntity } from "../orders/entities/order-item.entity";
import { OrderEntity } from "../orders/entities/order.entity";
import { ProductEntity } from "../products/entities/product.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { QueryReviewsDto } from "./dto/query-reviews.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewsRepository: Repository<ReviewEntity>,
    private readonly dataSource: DataSource
  ) {}

  async create(authorId: number, dto: CreateReviewDto) {
    return this.dataSource.transaction(async (manager) => {
      const orderItem = await manager.findOne(OrderItemEntity, {
        where: { id: dto.orderItemId },
      });
      if (!orderItem) {
        throw new NotFoundException("Товар у замовленні не знайдено");
      }

      const order = await manager.findOne(OrderEntity, {
        where: { id: orderItem.orderId },
      });
      if (!order || order.buyerId !== authorId) {
        throw new ForbiddenException("Це не ваша покупка");
      }
      if (order.status !== "delivered") {
        throw new BadRequestException("Відгук можливий лише для доставлених замовлень");
      }

      const existing = await manager.findOne(ReviewEntity, {
        where: { orderItemId: dto.orderItemId },
      });
      if (existing) {
        throw new ConflictException("Відгук на цю покупку вже залишено");
      }

      const review = new ReviewEntity();
      review.orderItemId = dto.orderItemId;
      review.authorId = authorId;
      review.productId = orderItem.productId;
      review.sellerId = orderItem.sellerId;
      review.rating = dto.rating;
      review.text = dto.text;
      const saved = await manager.save(review);

      await this.recomputeProductRating(manager, orderItem.productId);

      return saved;
    });
  }

  async findByProduct(query: QueryReviewsDto) {
    return this.reviewsRepository.find({
      where: { productId: query.productId },
      order: { createdAt: "DESC" },
      take: query.limit,
      skip: query.offset,
    });
  }

  findBySeller(sellerId: number) {
    return this.reviewsRepository.find({
      where: { sellerId },
      order: { createdAt: "DESC" },
    });
  }

  async reply(id: number, sellerId: number, replyText: string) {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException("Відгук не знайдено");
    }
    if (review.sellerId !== sellerId) {
      throw new ForbiddenException("Ви не можете відповідати на цей відгук");
    }
    review.reply = replyText;
    review.repliedAt = new Date();
    return this.reviewsRepository.save(review);
  }

  private async recomputeProductRating(manager: DataSource["manager"], productId: number) {
    const { avg, count } = await manager
      .createQueryBuilder(ReviewEntity, "review")
      .select("AVG(review.rating)", "avg")
      .addSelect("COUNT(review.id)", "count")
      .where("review.productId = :productId", { productId })
      .getRawOne();

    await manager.update(ProductEntity, productId, {
      rating: Number(avg ?? 0).toFixed(1) as unknown as number,
      reviewCount: Number(count ?? 0),
    });
  }
}
