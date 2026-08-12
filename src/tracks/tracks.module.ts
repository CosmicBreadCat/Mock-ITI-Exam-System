import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksService } from './tracks.service';
import { DepartmentsService } from './departments.service';
import { TracksController } from './tracks.controller';
import { DepartmentsController } from './departments.controller';
import { Track } from './entities/track.entity';
import { Department } from './entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Department])],
  exports: [TracksService, DepartmentsService],
  controllers: [TracksController, DepartmentsController],
  providers: [TracksService, DepartmentsService],
})
export class TracksModule {}
