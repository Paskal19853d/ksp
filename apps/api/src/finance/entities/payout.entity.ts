import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

export type PayoutStatus = "pending" | "paid";

@Entity("payouts")
export class PayoutEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sellerId" })
  seller: UserEntity;

  @Column()
  sellerId: number;

  @Column({ type: "int" })
  gmv: number;

  @Column({ type: "int" })
  commission: number;

  // gmv - commission, what the seller actually receives
  @Column({ type: "int" })
  netAmount: number;

  @Column({ type: "timestamp" })
  periodStart: Date;

  @Column({ type: "timestamp" })
  periodEnd: Date;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status: PayoutStatus;

  @Column({ type: "timestamp", nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
