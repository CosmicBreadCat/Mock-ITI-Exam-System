import { IsInt, IsPositive } from 'class-validator';

export class CreateCourseClassDto {
  @IsInt()
  @IsPositive()
  courseId!: number;

  @IsInt()
  @IsPositive()
  instructorId!: number;

  @IsInt()
  @IsPositive()
  intakeId!: number;

  @IsInt()
  @IsPositive()
  branchId!: number;

  @IsInt()
  @IsPositive()
  trackId!: number;
}
