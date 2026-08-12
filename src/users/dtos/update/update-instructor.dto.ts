import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateInstructorDto } from '../create/create-instructor.dto';

export class UpdateInstructorDto extends PartialType(
  OmitType(CreateInstructorDto, ['role'] as const),
) {}
