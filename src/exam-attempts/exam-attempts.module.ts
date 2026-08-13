import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamAttemptsService } from './exam-attempts.service';
import { ExamAttemptsController } from './exam-attempts.controller';
import { ExamHistory } from '../exams/entities/exam-history.entity';
import { ExamQuestionHistory } from '../exams/entities/exam-question-history.entity';
import { ExamsModule } from '../exams/exams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamHistory, ExamQuestionHistory]),
    ExamsModule,
  ],
  exports: [ExamAttemptsService],
  controllers: [ExamAttemptsController],
  providers: [ExamAttemptsService],
})
export class ExamAttemptsModule {}
