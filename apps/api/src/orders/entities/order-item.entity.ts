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

  // Commission rate at purchase time — snapshot, not a live lookup, so a later
  // change to the category's rate never retroactively rewrites past payouts.
  @Column({ type: "int", default: 0 })
  commissionPct: number;

  @Index()
  @Column()
  sellerId: number;

  // Set once this item is claimed by a payout, so the same revenue can never
  // be included in two payouts — the source of truth for "already paid out".
  @Index()
  @Column({ nullable: true })
  payoutId?: number;

  // Affiliate attribution — set only if the order was placed through a
  // blogger's link (see AffiliateLinkEntity). Independent from payoutId:
  // the same item owes the seller their net revenue AND, separately, owes
  // the blogger their affiliate cut — two distinct payout streams.
  @Index()
  @Column({ nullable: true })
  bloggerId?: number;

  @Column({ type: "int", nullable: true })
  affiliateCommissionPct?: number;

  @Index()
  @Column({ nullable: true })
  affiliatePayoutId?: number;
}
