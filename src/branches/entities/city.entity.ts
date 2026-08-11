import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Branch } from "./branch.entity";

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @OneToMany(() => Branch, (branch) => branch.city)
  branches!: Branch[];
}
