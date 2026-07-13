import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CategoryEntity } from "../../categories/entities/category.entity";

@Entity("commission_rules")
export class CommissionRuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => CategoryEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "categoryId" })
  category: CategoryEntity;

  @Column({ unique: true })
  categoryId: number;

  @Column({ type: "int" })
  pct: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
