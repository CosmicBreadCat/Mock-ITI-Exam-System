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
import { RequireRole } from '../decorators/require-role.decorator';
import { UserRole } from '../users/entities/users.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('course-classes')
export class CourseClassesController {
  constructor(private readonly courseClassesService: CourseClassesService) {}

  // --- Course Classes ---

  @Post()
  @RequireRole(UserRole.Manager)
  create(@Body() createCourseClassDto: CreateCourseClassDto) {
    return this.courseClassesService.create(createCourseClassDto);
  }

  @Get()
  findAll(@CurrentUser() curUser: JwtPayload) {
    return this.courseClassesService.findAll(curUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() curUser: JwtPayload) {
    return this.courseClassesService.findOne(+id, curUser);
  }

  @Patch(':id')
  @RequireRole(UserRole.Manager)
  update(
    @Param('id') id: string,
    @Body() updateCourseClassDto: UpdateCourseClassDto,
  ) {
    return this.courseClassesService.update(+id, updateCourseClassDto);
  }

  @Delete(':id')
  @RequireRole(UserRole.Manager)
  remove(@Param('id') id: string) {
    return this.courseClassesService.remove(+id);
  }

  // --- Course Class Students ---

  @Post(':id/students')
  @RequireRole(UserRole.Manager)
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
  @RequireRole(UserRole.Manager, UserRole.Instructor)
  findAllCourseClassStudents(
    @Param('id') id: string,
    @CurrentUser() curUser: JwtPayload,
  ) {
    return this.courseClassesService.findAllCourseClassStudents(+id, curUser);
  }

  @Get(':id/students/:courseClassStudentId')
  @RequireRole(UserRole.Manager, UserRole.Instructor)
  findOneCourseClassStudent(
    @Param('courseClassStudentId') courseClassStudentId: string,
    @CurrentUser() curUser: JwtPayload,
  ) {
    return this.courseClassesService.findOneCourseClassStudent(
      +courseClassStudentId,
      curUser,
    );
  }

  @Patch(':id/students/:courseClassStudentId')
  @RequireRole(UserRole.Manager)
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
  @RequireRole(UserRole.Manager)
  removeCourseClassStudent(
    @Param('courseClassStudentId') courseClassStudentId: string,
  ) {
    return this.courseClassesService.removeCourseClassStudent(
      +courseClassStudentId,
    );
  }
}
