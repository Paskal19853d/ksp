import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { ProductEntity } from "../../products/entities/product.entity";
import { OrderItemEntity } from "../../orders/entities/order-item.entity";

@Entity("reviews")
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => OrderItemEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "orderItemId" })
  orderItem: OrderItemEntity;

  @Column({ unique: true })
  orderItemId: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" })
  author: UserEntity;

  @Column()
  authorId: number;

  @Index()
  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: ProductEntity;

  @Column()
  productId: number;

  @Index()
  @Column()
  sellerId: number;

  @Column({ type: "int" })
  rating: number;

  @Column({ type: "text" })
  text: string;

  @Column({ nullable: true, length: 1000 })
  reply?: string;

  @Column({ type: "timestamp", nullable: true })
  repliedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
