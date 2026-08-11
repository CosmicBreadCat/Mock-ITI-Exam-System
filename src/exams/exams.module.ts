import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam } from './entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  exports: [ExamsService],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
