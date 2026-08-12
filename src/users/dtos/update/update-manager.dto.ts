import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateManagerDto } from '../create/create-manager.dto';

export class UpdateManagerDto extends PartialType(
  OmitType(CreateManagerDto, ['role'] as const),
) {}
