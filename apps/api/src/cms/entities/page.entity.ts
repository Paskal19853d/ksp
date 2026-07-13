import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type PageStatus = "draft" | "published";

export type PageBlock =
  | { type: "heading"; text: string }
  | { type: "richtext"; html: string }
  | { type: "image"; url: string; alt: string };

@Entity("pages")
export class PageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Index({ unique: true })
  @Column({ length: 100 })
  slug: string;

  @Column({ type: "varchar", length: 20, default: "draft" })
  status: PageStatus;

  @Column({ type: "jsonb", default: () => "'[]'" })
  content: PageBlock[];

  @Column()
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
