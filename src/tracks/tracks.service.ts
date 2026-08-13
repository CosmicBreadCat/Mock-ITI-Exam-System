import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Department } from './entities/department.entity';
import { TrackCourse } from './entities/track-course.entity';

@Injectable()
export class TracksService {
  private readonly logger = new Logger(TracksService.name);

  constructor(
    @InjectRepository(Track) private trackRepo: Repository<Track>,
    @InjectRepository(TrackCourse)
    private trackCourseRepo: Repository<TrackCourse>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const track = this.trackRepo.create({
      name: createTrackDto.name,
      department: { id: createTrackDto.departmentId },
    });
    const saveResult = await this.trackRepo.save(track);

    this.logger.log(
      `Track with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAll() {
    return this.trackRepo.find({ relations: { department: true } });
  }

  async findOne(id: number) {
    const track = await this.trackRepo.findOne({
      where: { id },
      relations: { department: true },
    });

    if (!track) {
      this.logger.warn(`Track with id ${id} is not found`);
      throw new NotFoundException('track not found');
    }
    return track;
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);
    const { departmentId, ...attrs } = updateTrackDto;

    Object.assign(track, attrs);
    if (departmentId !== undefined) {
      track.department = { id: departmentId } as Department;
    }
    const saveResult = await this.trackRepo.save(track);

    this.logger.log(`Track with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const track = await this.findOne(id);
    const removeResult = await this.trackRepo.remove(track);

    this.logger.log(`Track with id ${id} has been removed successfully`);
    return removeResult;
  }
}
