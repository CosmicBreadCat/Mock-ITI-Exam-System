import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class SubmitExamAnswerDto {
  @IsInt()
  @IsPositive()
  examQuestionId!: number;

  @IsString()
  @IsNotEmpty()
  answer!: string;
}

export class SubmitExamAttemptDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SubmitExamAnswerDto)
  answers!: SubmitExamAnswerDto[];
}
