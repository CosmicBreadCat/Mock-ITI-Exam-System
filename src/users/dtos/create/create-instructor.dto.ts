import { IsInt, IsPositive } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateInstructorDto extends CreateUserDto {
  @IsInt()
  @IsPositive()
  salary!: number;
}
