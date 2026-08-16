import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ExamType } from '../entities/exam.entity';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsEnum(ExamType)
  type?: ExamType;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsInt()
  @IsPositive()
  minDegree!: number;

  @IsInt()
  @IsPositive()
  maxDegree!: number;

  @IsInt()
  @IsPositive()
  passDegree!: number;

  @IsInt()
  @IsPositive()
  sessionDurationMin!: number;

  @IsInt()
  @IsPositive()
  courseClassId!: number;
}
