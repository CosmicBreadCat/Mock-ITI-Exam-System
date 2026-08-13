import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TrackCourse } from '../../tracks/entities/track-course.entity';
import { CourseClass } from '../../course-classes/entities/course-class.entity';

@Entity()
@Check('max_degree > min_degree')
@Check('min_degree > 0')
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  maxDegree!: number;

  @Column()
  minDegree!: number;

  @OneToMany(() => TrackCourse, (trackCourse) => trackCourse.course)
  trackCourses!: TrackCourse[];

  @OneToMany(() => CourseClass, (courseClass) => courseClass.course)
  courseClasses!: CourseClass[];
}
