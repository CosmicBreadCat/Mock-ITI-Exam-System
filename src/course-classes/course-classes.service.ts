import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseClassDto } from './dto/create-course-class.dto';
import { UpdateCourseClassDto } from './dto/update-course-class.dto';
import { CourseClass } from './entities/course-class.entity';
import { CourseClassStudent } from './entities/course-class-student.entity';

@Injectable()
export class CourseClassesService {
  constructor(
    @InjectRepository(CourseClass)
    private courseClassRepo: Repository<CourseClass>,
    @InjectRepository(CourseClassStudent)
    private courseClassStudentRepo: Repository<CourseClassStudent>,
  ) {}

  create(createCourseClassDto: CreateCourseClassDto) {
    return 'This action adds a new courseClass';
  }

  findAll() {
    return `This action returns all courseClasses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courseClass`;
  }

  update(id: number, updateCourseClassDto: UpdateCourseClassDto) {
    return `This action updates a #${id} courseClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseClass`;
  }
}
