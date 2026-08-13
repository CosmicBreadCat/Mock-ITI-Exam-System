import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Student } from '../../users/entities/students.entity';
import { TrackCourse } from './track-course.entity';
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

  @OneToMany(() => TrackCourse, (trackCourse) => trackCourse.track)
  trackCourses!: TrackCourse[];

  @OneToMany(() => CourseClass, (courseClass) => courseClass.track)
  courseClasses!: CourseClass[];
}
