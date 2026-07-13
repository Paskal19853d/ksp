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

export type VideoStatus = "published" | "hidden";

@Entity("videos")
export class VideoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" })
  author: UserEntity;

  @Column()
  authorId: number;

  // Set by the client after a direct-to-S3 upload via the existing
  // /media/presign flow (kind: "video") — this module never handles bytes.
  @Column({ length: 500 })
  videoUrl: string;

  @Column({ length: 500, default: "" })
  thumbnailUrl: string;

  @Column({ type: "text", default: "" })
  caption: string;

  // At most one tagged product per video for v1 — matches every mock
  // (products.ts MockVideo.pid, blogger.ts BloggerVideo) which is always
  // singular; StreamEntity.productIds (plural) was for a different case
  // (a whole live shop window), not applicable here.
  @ManyToOne(() => ProductEntity, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "productId" })
  product?: ProductEntity;

  @Column({ nullable: true })
  productId?: number;

  @Index()
  @Column({ type: "varchar", length: 20, default: "published" })
  status: VideoStatus;

  @Column({ type: "int", default: 0 })
  likesCount: number;

  @Column({ type: "int", default: 0 })
  commentsCount: number;

  @Column({ type: "int", default: 0 })
  viewsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
