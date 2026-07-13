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

export type StreamStatus = "scheduled" | "live" | "ended";

@Entity("streams")
export class StreamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "hostId" })
  host: UserEntity;

  @Column()
  hostId: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: "text", default: "" })
  description: string;

  // Placeholder for real video infra (ENGINE.md §4 — deferred to a managed
  // provider like Cloudflare Stream/Mux). For now just a direct mp4/HLS URL.
  @Column({ type: "varchar", length: 500, default: "" })
  videoUrl: string;

  @Index()
  @Column({ type: "varchar", length: 20, default: "scheduled" })
  status: StreamStatus;

  // Tagged products, in display order — the source of truth for stock/price
  // stays ProductEntity, this is only which products are featured and in what order.
  @Column("int", { array: true, default: () => "'{}'" })
  productIds: number[];

  @Column({ type: "timestamp", nullable: true })
  scheduledAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  startedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  endedAt?: Date;

  // Snapshot fields, filled in when the stream ends — avoids re-aggregating
  // Redis/ephemeral counters or order history every time past-stream stats are viewed.
  @Column({ type: "int", default: 0 })
  peakViewers: number;

  @Column({ type: "int", default: 0 })
  ordersCount: number;

  @Column({ type: "int", default: 0 })
  income: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
