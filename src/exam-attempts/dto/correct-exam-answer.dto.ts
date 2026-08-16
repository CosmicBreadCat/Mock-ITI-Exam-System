import { IsInt, Min } from 'class-validator';

export class CorrectExamAnswerDto {
  @IsInt()
  @Min(0)
  awardedDegree!: number;
}
