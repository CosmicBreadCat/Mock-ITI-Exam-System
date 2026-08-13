import { IsInt, IsPositive } from 'class-validator';

export class CreateExamQuestionDto {
  @IsInt()
  @IsPositive()
  questionId!: number;

  @IsInt()
  @IsPositive()
  degree!: number;
}
