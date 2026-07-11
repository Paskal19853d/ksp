import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { OrderItemEntity } from "./order-item.entity";

export type OrderStatus =
  | "new"
  | "packing"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "return_requested";

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  orderNo: string;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "buyerId" })
  buyer: UserEntity;

  @Column()
  buyerId: number;

  @Column({ type: "varchar", length: 20, default: "new" })
  status: OrderStatus;

  @Column({ type: "int" })
  sum: number;

  @Column({ length: 120 })
  recipientName: string;

  @Column({ length: 20 })
  recipientPhone: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 200 })
  address: string;

  @Column({ length: 30 })
  deliveryMethod: string;

  @Column({ length: 30 })
  paymentMethod: string;

  @Column({ nullable: true, length: 500 })
  returnReason?: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true, eager: true })
  items: OrderItemEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
