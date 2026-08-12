import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateIntakeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
