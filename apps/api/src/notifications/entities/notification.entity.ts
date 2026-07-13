import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

export type NotificationType = "order" | "stream" | "review" | "moderation" | "payout" | "social";

@Entity("notifications")
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "recipientId" })
  recipient: UserEntity;

  @Column()
  recipientId: number;

  @Column({ type: "varchar", length: 20 })
  type: NotificationType;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 500, default: "" })
  body: string;

  @Column({ nullable: true, length: 300 })
  link?: string;

  @Index()
  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
