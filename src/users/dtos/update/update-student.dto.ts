import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateStudentDto } from '../create/create-student.dto';

export class UpdateStudentDto extends PartialType(
  OmitType(CreateStudentDto, ['role'] as const),
) {}
