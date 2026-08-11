import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseClassesService } from './course-classes.service';
import { CreateCourseClassDto } from './dto/create-course-class.dto';
import { UpdateCourseClassDto } from './dto/update-course-class.dto';

@Controller('course-classes')
export class CourseClassesController {
  constructor(private readonly courseClassesService: CourseClassesService) {}

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
  update(@Param('id') id: string, @Body() updateCourseClassDto: UpdateCourseClassDto) {
    return this.courseClassesService.update(+id, updateCourseClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseClassesService.remove(+id);
  }
}
