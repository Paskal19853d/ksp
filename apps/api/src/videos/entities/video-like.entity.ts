import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VideoEntity } from "./video.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity("video_likes")
@Index(["videoId", "userId"], { unique: true })
export class VideoLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VideoEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "videoId" })
  video: VideoEntity;

  @Column()
  videoId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
