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

export type AffiliatePayoutStatus = "pending" | "paid";

@Entity("affiliate_payouts")
export class AffiliatePayoutEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bloggerId" })
  blogger: UserEntity;

  @Column()
  bloggerId: number;

  @Column({ type: "int" })
  amount: number;

  @Column({ type: "timestamp" })
  periodStart: Date;

  @Column({ type: "timestamp" })
  periodEnd: Date;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status: AffiliatePayoutStatus;

  @Column({ type: "timestamp", nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
