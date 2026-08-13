import { IsInt, IsPositive } from 'class-validator';

export class CreateExamStudentDto {
  @IsInt()
  @IsPositive()
  studentId!: number;
}
