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
import { ProductEntity } from "../../products/entities/product.entity";

export type AdCampaignStatus = "active" | "paused" | "finished";

@Entity("ad_campaigns")
export class AdCampaignEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sellerId" })
  seller: UserEntity;

  @Column()
  sellerId: number;

  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: ProductEntity;

  @Column()
  productId: number;

  @Column({ type: "int" })
  budget: number;

  @Column({ type: "int", default: 0 })
  spent: number;

  @Column({ type: "int", default: 0 })
  clicks: number;

  @Column({ type: "varchar", length: 20, default: "active" })
  status: AdCampaignStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
