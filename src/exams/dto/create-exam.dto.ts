import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
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

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  lateEntryMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  gracePeriodMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  maxAttempts?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  retakeCooldownMin?: number;

  @IsInt()
  @IsPositive()
  courseClassId!: number;
}
