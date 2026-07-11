import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "../../products/entities/product.entity";

@Entity("order_items")
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "orderId" })
  order: OrderEntity;

  @Column()
  orderId: number;

  @ManyToOne(() => ProductEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "productId" })
  product: ProductEntity;

  @Column()
  productId: number;

  // Snapshot fields — captured at purchase time so the order stays accurate
  // even if the product's name/price/seller changes or the product is later deleted.
  @Column({ length: 200 })
  productName: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "int" })
  qty: number;

  @Index()
  @Column()
  sellerId: number;
}
