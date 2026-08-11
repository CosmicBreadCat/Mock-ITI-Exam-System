import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../../users/entities/students.entity';
import { City } from './city.entity';
import { CourseClass } from '../../course-classes/entities/course-class.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @OneToMany(() => Student, (student) => student.branch)
  students!: Student[];

  @OneToMany(() => CourseClass, (courseClass) => courseClass.branch)
  courseClasses!: CourseClass[];

  @ManyToOne(() => City, (city) => city.branches, { onDelete: 'RESTRICT' })
  city!: City;
}
