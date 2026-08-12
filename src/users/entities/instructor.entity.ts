import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { CourseClass } from '../../course-classes/entities/course-class.entity';

@Entity()
export class Instructor {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @Column({ type: 'float' })
  salary!: number;

  @OneToMany(() => CourseClass, (courseClass) => courseClass.instructor)
  courseClasses!: CourseClass[];
}
