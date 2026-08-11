import { Injectable } from '@nestjs/common';
import { CreateCourseClassDto } from './dto/create-course-class.dto';
import { UpdateCourseClassDto } from './dto/update-course-class.dto';

@Injectable()
export class CourseClassesService {
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
