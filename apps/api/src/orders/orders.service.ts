import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DataSource, Repository } from "typeorm";
import { OrderEntity, OrderStatus } from "./entities/order.entity";
import { OrderItemEntity } from "./entities/order-item.entity";
import { ProductEntity } from "../products/entities/product.entity";
import { CreateOrderDto } from "./dto/create-order.dto";

export class ProductPurchasedEvent {
  constructor(
    public readonly productId: number,
    public readonly newStock: number
  ) {}
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(buyerId: number, dto: CreateOrderDto) {
    const purchaseEvents: ProductPurchasedEvent[] = [];

    const savedOrder = await this.dataSource.transaction(async (manager) => {
      const productIds = dto.items.map((i) => i.productId);
      const products = await manager.find(ProductEntity, {
        where: productIds.map((id) => ({ id })),
      });

      if (products.length !== new Set(productIds).size) {
        throw new NotFoundException("Один або декілька товарів не знайдено");
      }

      const items: OrderItemEntity[] = [];
      let sum = 0;

      for (const input of dto.items) {
        const product = products.find((p) => p.id === input.productId)!;
        if (!product.active) {
          throw new BadRequestException(`Товар "${product.name}" більше не доступний`);
        }

        // Atomic stock decrement — only succeeds if enough stock remains at this
        // exact moment, preventing overselling under concurrent checkouts.
        const result = await manager
          .createQueryBuilder()
          .update(ProductEntity)
          .set({ stock: () => "stock - :qty", salesCount: () => "salesCount + :qty" })
          .where("id = :id AND stock >= :qty", { id: product.id, qty: input.qty })
          .setParameters({ qty: input.qty })
          .execute();

        if (result.affected === 0) {
          throw new BadRequestException(
            `Недостатньо товару "${product.name}" на складі (залишок: ${product.stock})`
          );
        }

        const item = new OrderItemEntity();
        item.productId = product.id;
        item.productName = product.name;
        item.price = product.price;
        item.qty = input.qty;
        item.sellerId = product.sellerId;
        items.push(item);
        sum += product.price * input.qty;

        purchaseEvents.push(new ProductPurchasedEvent(product.id, product.stock - input.qty));
      }

      const order = new OrderEntity();
      order.orderNo = this.generateOrderNo();
      order.buyerId = buyerId;
      order.status = "new";
      order.sum = sum;
      order.recipientName = dto.recipientName;
      order.recipientPhone = dto.recipientPhone;
      order.city = dto.city;
      order.address = dto.address;
      order.deliveryMethod = dto.deliveryMethod;
      order.paymentMethod = dto.paymentMethod;
      order.items = items;

      return manager.save(order);
    });

    // Emitted only after the transaction commits — a rollback (e.g. a later
    // item in the same order failing) must never announce a stock change
    // that didn't actually happen.
    for (const event of purchaseEvents) {
      this.eventEmitter.emit("product.purchased", event);
    }

    return savedOrder;
  }

  findByBuyer(buyerId: number) {
    return this.ordersRepository.find({
      where: { buyerId },
      order: { createdAt: "DESC" },
    });
  }

  async findBySeller(sellerId: number) {
    return this.ordersRepository
      .createQueryBuilder("order")
      .innerJoin("order.items", "item")
      .where("item.sellerId = :sellerId", { sellerId })
      .distinct(true)
      .orderBy("order.createdAt", "DESC")
      .getMany();
  }

  async findOne(id: number, currentUserId: number) {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException("Замовлення не знайдено");
    }
    const isBuyer = order.buyerId === currentUserId;
    const isSeller = order.items.some((item) => item.sellerId === currentUserId);
    if (!isBuyer && !isSeller) {
      throw new ForbiddenException("Ви не маєте доступу до цього замовлення");
    }
    return order;
  }

  async updateStatus(id: number, sellerId: number, status: OrderStatus) {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException("Замовлення не знайдено");
    }
    const ownsItem = order.items.some((item) => item.sellerId === sellerId);
    if (!ownsItem) {
      throw new ForbiddenException("Ви не можете змінювати статус цього замовлення");
    }
    order.status = status;
    return this.ordersRepository.save(order);
  }

  async requestReturn(id: number, buyerId: number, reason: string) {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException("Замовлення не знайдено");
    }
    if (order.buyerId !== buyerId) {
      throw new ForbiddenException("Це не ваше замовлення");
    }
    if (order.status !== "delivered") {
      throw new BadRequestException("Повернення можливе лише для доставлених замовлень");
    }
    order.status = "return_requested";
    order.returnReason = reason;
    return this.ordersRepository.save(order);
  }

  private generateOrderNo() {
    const suffix = Math.floor(100000 + Math.random() * 899999);
    return `TX-${suffix}`;
  }
}
