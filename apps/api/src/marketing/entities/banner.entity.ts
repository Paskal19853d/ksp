import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("banners")
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 250, default: "" })
  subtitle: string;

  @Column({ length: 500 })
  imageUrl: string;

  @Column({ length: 300 })
  link: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: "int", default: 0 })
  clicks: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
