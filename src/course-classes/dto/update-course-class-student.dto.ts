import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseClassStudentDto } from './create-course-class-student.dto';

export class UpdateCourseClassStudentDto extends PartialType(
  CreateCourseClassStudentDto,
) {}
