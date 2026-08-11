import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Track } from './track.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @OneToMany(() => Track, (track) => track.department)
  tracks!: Track[];
}
