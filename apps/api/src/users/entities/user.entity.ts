import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export type UserRole = "buyer" | "seller" | "blogger" | "admin";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: "varchar", length: 20, default: "buyer" })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ default: false })
  blocked: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
