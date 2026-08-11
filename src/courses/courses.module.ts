import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { CourseTrack } from './entities/course-track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseTrack])],
  exports: [CoursesService],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
