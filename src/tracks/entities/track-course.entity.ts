import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
} from 'typeorm';
import { Track } from './track.entity';
import { Course } from '../../courses/entities/course.entity';

export enum CourseType {
  Mandatory = 'Mandatory',
  Optional = 'Optional',
}

@Entity()
@Unique(['track', 'course'])
export class TrackCourse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: CourseType })
  type!: CourseType;

  @ManyToOne(() => Track, (track) => track.trackCourses, {
    onDelete: 'RESTRICT',
  })
  track!: Track;

  @ManyToOne(() => Course, (course) => course.trackCourses, {
    onDelete: 'RESTRICT',
  })
  course!: Course;
}
