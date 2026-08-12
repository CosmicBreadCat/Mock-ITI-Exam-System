import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @IsPositive()
  cityId!: number;
}
