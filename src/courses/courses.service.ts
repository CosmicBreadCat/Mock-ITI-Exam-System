import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { maxDegreeCheckHandler } from '../helpers/max-degree-check.helper';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepo.create(createCourseDto);

    let saveResult: Course;
    try {
      saveResult = await this.courseRepo.save(course);
    } catch (error) {
      throw maxDegreeCheckHandler(error, 'Course');
    }

    this.logger.log(
      `Course with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAll() {
    return this.courseRepo.find();
  }

  async findOne(id: number) {
    const course = await this.courseRepo.findOneBy({ id });

    if (!course) {
      this.logger.warn(`Course with id ${id} is not found`);
      throw new NotFoundException('course not found');
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);

    let saveResult: Course;
    try {
      saveResult = await this.courseRepo.save(course);
    } catch (error) {
      throw maxDegreeCheckHandler(error, 'Course');
    }

    this.logger.log(`Course with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    const removeResult = await this.courseRepo.remove(course);

    this.logger.log(`Course with id ${id} has been removed successfully`);
    return removeResult;
  }
}
