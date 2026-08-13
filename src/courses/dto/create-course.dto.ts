import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @IsPositive()
  maxDegree!: number;

  @IsInt()
  @IsPositive()
  minDegree!: number;
}
