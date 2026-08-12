import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam } from './entities/exam.entity';
import { ExamHistory } from './entities/exam-history.entity';
import { ExamQuestion } from './entities/exam-question.entity';
import { ExamQuestionHistory } from './entities/exam-question-history.entity';
import { ExamStudent } from './entities/exam-student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exam,
      ExamHistory,
      ExamQuestion,
      ExamQuestionHistory,
      ExamStudent,
    ]),
  ],
  exports: [ExamsService],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
