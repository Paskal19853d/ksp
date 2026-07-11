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
import { CategoryEntity } from "../../categories/entities/category.entity";

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: "text", default: "" })
  description: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "int", default: 0 })
  compareAtPrice: number;

  @Column({ length: 40 })
  imageSeed: string;

  @Column({ type: "int", default: 0 })
  stock: number;

  @Column({ length: 30, default: "" })
  sku: string;

  @Column("text", { array: true, default: () => "'{}'" })
  variants: string[];

  @Column({ default: true })
  active: boolean;

  @Column({ type: "int", default: 0 })
  salesCount: number;

  // pg returns "numeric" columns as strings by default to avoid float precision
  // loss on values too large for JS numbers — a rating (0.0-5.0) has no such
  // risk, so transform it back to a real number for API consumers.
  @Column({
    type: "numeric",
    precision: 2,
    scale: 1,
    default: 0,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  rating: number;

  @Column({ type: "int", default: 0 })
  reviewCount: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sellerId" })
  seller: UserEntity;

  @Column()
  sellerId: number;

  @Index()
  @ManyToOne(() => CategoryEntity, { onDelete: "RESTRICT", eager: true })
  @JoinColumn({ name: "categoryId" })
  category: CategoryEntity;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
