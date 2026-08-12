import { IsInt, IsPositive } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateStudentDto extends CreateUserDto {
  @IsInt()
  @IsPositive()
  trackId!: number;

  @IsInt()
  @IsPositive()
  branchId!: number;

  @IsInt()
  @IsPositive()
  intakeId!: number;
}
