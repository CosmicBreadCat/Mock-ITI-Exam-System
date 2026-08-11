import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Student } from '../../users/entities/students.entity';
import { CourseTrack } from '../../courses/entities/course-track.entity';
import { CourseClass } from '../../course-classes/entities/course-class.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @ManyToOne(() => Department, (department) => department.tracks, {
    onDelete: 'CASCADE',
  })
  department!: Department;

  @OneToMany(() => Student, (student) => student.track)
  students!: Student[];

  @OneToMany(() => CourseTrack, (courseTrack) => courseTrack.track)
  courseTracks!: CourseTrack[];

  @OneToMany(() => CourseClass, (courseClass) => courseClass.track)
  courseClasses!: CourseClass[];
}
