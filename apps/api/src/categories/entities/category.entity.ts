import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("categories")
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 60 })
  name: string;

  @Column({ length: 8 })
  icon: string;

  @Column({ default: true })
  visible: boolean;
}
