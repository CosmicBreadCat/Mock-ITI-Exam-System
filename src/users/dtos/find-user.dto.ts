import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create/create-user.dto';

export class FindUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {}
