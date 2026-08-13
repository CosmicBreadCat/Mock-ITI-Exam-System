import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { CourseType } from '../entities/track-course.entity';

export class CreateTrackCourseDto {
  @IsInt()
  @IsPositive()
  courseId!: number;

  @IsEnum(CourseType)
  type!: CourseType;
}
