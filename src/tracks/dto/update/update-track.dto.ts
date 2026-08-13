import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from '../create/create-track.dto';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
