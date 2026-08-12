import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAdminDto } from '../create/create-admin.dto';

export class UpdateAdminDto extends PartialType(
  OmitType(CreateAdminDto, ['role'] as const),
) {}
