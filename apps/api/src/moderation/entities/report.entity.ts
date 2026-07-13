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

export type ReportTargetType = "product" | "review" | "chat_message" | "video";
export type ReportStatus = "pending" | "approved" | "rejected";

@Entity("reports")
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: "varchar", length: 20 })
  targetType: ReportTargetType;

  @Index()
  @Column()
  targetId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reporterId" })
  reporter: UserEntity;

  @Column()
  reporterId: number;

  @Column({ length: 500 })
  reason: string;

  @Index()
  @Column({ type: "varchar", length: 20, default: "pending" })
  status: ReportStatus;

  @Column({ nullable: true })
  resolvedById?: number;

  @Column({ type: "timestamp", nullable: true })
  resolvedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
