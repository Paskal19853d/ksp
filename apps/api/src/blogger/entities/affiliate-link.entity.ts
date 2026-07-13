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

@Entity("affiliate_links")
export class AffiliateLinkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bloggerId" })
  blogger: UserEntity;

  @Column()
  bloggerId: number;

  @ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: ProductEntity;

  @Column()
  productId: number;

  @Index({ unique: true })
  @Column({ length: 60 })
  code: string;

  @Column({ type: "int" })
  pct: number;

  @Column({ default: true })
  active: boolean;

  @Column({ type: "int", default: 0 })
  clicks: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
