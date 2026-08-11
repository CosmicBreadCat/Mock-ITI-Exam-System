import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseClassesService } from './course-classes.service';
import { CourseClassesController } from './course-classes.controller';
import { CourseClass } from './entities/course-class.entity';
import { CourseClassStudent } from './entities/course-class-student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseClass, CourseClassStudent])],
  exports: [CourseClassesService],
  controllers: [CourseClassesController],
  providers: [CourseClassesService],
})
export class CourseClassesModule {}
