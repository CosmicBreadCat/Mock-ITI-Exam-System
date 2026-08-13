import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourseClassesService } from './course-classes.service';
import { CreateCourseClassDto } from './dto/create-course-class.dto';
import { UpdateCourseClassDto } from './dto/update-course-class.dto';
import { CreateCourseClassStudentDto } from './dto/create-course-class-student.dto';
import { UpdateCourseClassStudentDto } from './dto/update-course-class-student.dto';

@Controller('course-classes')
export class CourseClassesController {
  constructor(private readonly courseClassesService: CourseClassesService) {}

  // --- Course Classes ---

  @Post()
  create(@Body() createCourseClassDto: CreateCourseClassDto) {
    return this.courseClassesService.create(createCourseClassDto);
  }

  @Get()
  findAll() {
    return this.courseClassesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseClassesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseClassDto: UpdateCourseClassDto,
  ) {
    return this.courseClassesService.update(+id, updateCourseClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseClassesService.remove(+id);
  }

  // --- Course Class Students ---

  @Post(':id/students')
  createCourseClassStudent(
    @Param('id') id: string,
    @Body() createCourseClassStudentDto: CreateCourseClassStudentDto,
  ) {
    return this.courseClassesService.createCourseClassStudent(
      +id,
      createCourseClassStudentDto,
    );
  }

  @Get(':id/students')
  findAllCourseClassStudents(@Param('id') id: string) {
    return this.courseClassesService.findAllCourseClassStudents(+id);
  }

  @Get(':id/students/:courseClassStudentId')
  findOneCourseClassStudent(
    @Param('courseClassStudentId') courseClassStudentId: string,
  ) {
    return this.courseClassesService.findOneCourseClassStudent(
      +courseClassStudentId,
    );
  }

  @Patch(':id/students/:courseClassStudentId')
  updateCourseClassStudent(
    @Param('courseClassStudentId') courseClassStudentId: string,
    @Body() updateCourseClassStudentDto: UpdateCourseClassStudentDto,
  ) {
    return this.courseClassesService.updateCourseClassStudent(
      +courseClassStudentId,
      updateCourseClassStudentDto,
    );
  }

  @Delete(':id/students/:courseClassStudentId')
  removeCourseClassStudent(
    @Param('courseClassStudentId') courseClassStudentId: string,
  ) {
    return this.courseClassesService.removeCourseClassStudent(
      +courseClassStudentId,
    );
  }
}
