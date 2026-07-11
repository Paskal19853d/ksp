import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StreamEntity } from "../../streams/entities/stream.entity";
import { UserEntity } from "../../users/entities/user.entity";

@Entity("chat_messages")
export class ChatMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => StreamEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "streamId" })
  stream: StreamEntity;

  @Column()
  streamId: number;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" })
  author: UserEntity;

  @Column()
  authorId: number;

  @Column({ length: 500 })
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
