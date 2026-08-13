import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UpdateTrackDepartmentDto } from './dto/update-track-department.dto';
import { CreateTrackCourseDto } from './dto/create/create-track-course.dto';
import { UpdateTrackCourseDto } from './dto/update-track-course.dto';
import { Track } from './entities/track.entity';
import { Department } from './entities/department.entity';
import { TrackCourse } from './entities/track-course.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class TracksService {
  private readonly logger = new Logger(TracksService.name);

  constructor(
    @InjectRepository(Track) private trackRepo: Repository<Track>,
    @InjectRepository(TrackCourse)
    private trackCourseRepo: Repository<TrackCourse>,
  ) {}

  // --- Tracks ---

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

  async updateTrackDepartment(
    id: number,
    updateTrackDepartmentDto: UpdateTrackDepartmentDto,
  ) {
    const track = await this.findOne(id);
    track.department = {
      id: updateTrackDepartmentDto.departmentId,
    } as Department;
    const saveResult = await this.trackRepo.save(track);

    this.logger.log(
      `Track with id ${id} has had its department updated successfully`,
    );
    return saveResult;
  }

  // --- Track Courses ---

  async createTrackCourse(
    trackId: number,
    createTrackCourseDto: CreateTrackCourseDto,
  ) {
    const trackCourse = this.trackCourseRepo.create({
      track: { id: trackId } as Track,
      course: { id: createTrackCourseDto.courseId } as Course,
      type: createTrackCourseDto.type,
    });
    const saveResult = await this.trackCourseRepo.save(trackCourse);

    this.logger.log(
      `TrackCourse with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAllTrackCourses(trackId: number) {
    return this.trackCourseRepo.find({
      where: { track: { id: trackId } },
      relations: { course: true },
    });
  }

  async findOneTrackCourse(id: number) {
    const trackCourse = await this.trackCourseRepo.findOne({
      where: { id },
      relations: { track: true, course: true },
    });

    if (!trackCourse) {
      this.logger.warn(`TrackCourse with id ${id} is not found`);
      throw new NotFoundException('track course not found');
    }
    return trackCourse;
  }

  async updateTrackCourse(
    id: number,
    updateTrackCourseDto: UpdateTrackCourseDto,
  ) {
    const trackCourse = await this.findOneTrackCourse(id);
    const { courseId, ...attrs } = updateTrackCourseDto;

    Object.assign(trackCourse, attrs);
    if (courseId !== undefined) {
      trackCourse.course = { id: courseId } as Course;
    }
    const saveResult = await this.trackCourseRepo.save(trackCourse);

    this.logger.log(`TrackCourse with id ${id} has been updated successfully`);
    return saveResult;
  }

  async removeTrackCourse(id: number) {
    const trackCourse = await this.findOneTrackCourse(id);
    const removeResult = await this.trackCourseRepo.remove(trackCourse);

    this.logger.log(`TrackCourse with id ${id} has been removed successfully`);
    return removeResult;
  }
}
