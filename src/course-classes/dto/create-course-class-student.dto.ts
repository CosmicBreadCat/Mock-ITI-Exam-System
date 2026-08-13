import { IsInt, IsPositive } from 'class-validator';

export class CreateCourseClassStudentDto {
  @IsInt()
  @IsPositive()
  studentId!: number;
}
