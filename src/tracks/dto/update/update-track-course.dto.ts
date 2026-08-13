import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackCourseDto } from '../create/create-track-course.dto';

export class UpdateTrackCourseDto extends PartialType(CreateTrackCourseDto) {}
