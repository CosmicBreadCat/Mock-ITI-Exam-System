import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @IsPositive()
  departmentId!: number;
}
