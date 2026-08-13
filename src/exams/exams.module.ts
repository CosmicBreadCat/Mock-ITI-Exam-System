import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam } from './entities/exam.entity';
import { ExamQuestion } from './entities/exam-question.entity';
import { ExamStudent } from './entities/exam-student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamQuestion, ExamStudent])],
  exports: [ExamsService],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
