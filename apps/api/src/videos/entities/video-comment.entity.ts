import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VideoEntity } from "./video.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity("video_comments")
export class VideoCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => VideoEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "videoId" })
  video: VideoEntity;

  @Column()
  videoId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" })
  author: UserEntity;

  @Column()
  authorId: number;

  @Column({ length: 500 })
  text: string;

  @Column({ type: "int", default: 0 })
  likesCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
