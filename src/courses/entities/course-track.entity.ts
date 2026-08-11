import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Track } from '../../tracks/entities/track.entity';
import { Course } from './course.entity';

@Entity()
@Unique(['course', 'track'])
export class CourseTrack {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Course, (course) => course.courseTracks, {
    onDelete: 'RESTRICT',
  })
  course!: Course;

  @ManyToOne(() => Track, (track) => track.courseTracks, {
    onDelete: 'RESTRICT',
  })
  track!: Track;
}
