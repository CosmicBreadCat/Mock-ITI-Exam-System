import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Track } from './track.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
@Unique(['track', 'course'])
export class TrackCourse {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Track, (track) => track.trackCourses, {
    onDelete: 'RESTRICT',
  })
  track!: Track;

  @ManyToOne(() => Course, (course) => course.trackCourses, {
    onDelete: 'RESTRICT',
  })
  course!: Course;
}
