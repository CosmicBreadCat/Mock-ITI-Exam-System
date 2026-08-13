import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UpdateTrackDepartmentDto } from './dto/update-track-department.dto';
import { CreateTrackCourseDto } from './dto/create/create-track-course.dto';
import { UpdateTrackCourseDto } from './dto/update-track-course.dto';
import { RequireRole } from '../decorators/require-role.decorator';
import { UserRole } from '../users/entities/users.entity';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  // --- Tracks ---

  @Post()
  @RequireRole(UserRole.Admin)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(+id);
  }

  @Patch(':id')
  @RequireRole(UserRole.Admin)
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(+id, updateTrackDto);
  }

  @Patch(':id/department')
  @RequireRole(UserRole.Manager)
  updateTrackDepartment(
    @Param('id') id: string,
    @Body() updateTrackDepartmentDto: UpdateTrackDepartmentDto,
  ) {
    return this.tracksService.updateTrackDepartment(
      +id,
      updateTrackDepartmentDto,
    );
  }

  @Delete(':id')
  @RequireRole(UserRole.Admin)
  remove(@Param('id') id: string) {
    return this.tracksService.remove(+id);
  }

  // --- Track Courses ---

  @Post(':id/courses')
  @RequireRole(UserRole.Admin)
  createTrackCourse(
    @Param('id') id: string,
    @Body() createTrackCourseDto: CreateTrackCourseDto,
  ) {
    return this.tracksService.createTrackCourse(+id, createTrackCourseDto);
  }

  @Get(':id/courses')
  findAllTrackCourses(@Param('id') id: string) {
    return this.tracksService.findAllTrackCourses(+id);
  }

  @Get(':id/courses/:trackCourseId')
  findOneTrackCourse(@Param('trackCourseId') trackCourseId: string) {
    return this.tracksService.findOneTrackCourse(+trackCourseId);
  }

  @Patch(':id/courses/:trackCourseId')
  @RequireRole(UserRole.Admin)
  updateTrackCourse(
    @Param('trackCourseId') trackCourseId: string,
    @Body() updateTrackCourseDto: UpdateTrackCourseDto,
  ) {
    return this.tracksService.updateTrackCourse(
      +trackCourseId,
      updateTrackCourseDto,
    );
  }

  @Delete(':id/courses/:trackCourseId')
  @RequireRole(UserRole.Admin)
  removeTrackCourse(@Param('trackCourseId') trackCourseId: string) {
    return this.tracksService.removeTrackCourse(+trackCourseId);
  }
}
