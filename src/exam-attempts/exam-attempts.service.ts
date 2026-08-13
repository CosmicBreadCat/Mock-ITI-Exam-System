import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamHistory } from '../exams/entities/exam-history.entity';
import { ExamQuestionHistory } from '../exams/entities/exam-question-history.entity';
import { ExamsService } from '../exams/exams.service';
import { SubmitExamAttemptDto } from './dto/submit-exam-attempt.dto';
import { CorrectExamAnswerDto } from './dto/correct-exam-answer.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ExamAttemptsService {
  constructor(
    @InjectRepository(ExamHistory)
    private examHistoryRepo: Repository<ExamHistory>,
    @InjectRepository(ExamQuestionHistory)
    private examQuestionHistoryRepo: Repository<ExamQuestionHistory>,
    private examsService: ExamsService,
  ) {}

  findForStudent(examId: number, curUser: JwtPayload) {
    return `This action returns exam ${examId}'s attempt info for the current student`;
  }

  start(examId: number, curUser: JwtPayload) {
    return `This action starts a new attempt for exam ${examId}`;
  }

  submit(
    attemptId: number,
    submitExamAttemptDto: SubmitExamAttemptDto,
    curUser: JwtPayload,
  ) {
    return `This action submits attempt ${attemptId}`;
  }

  correctAnswer(
    answerId: number,
    correctExamAnswerDto: CorrectExamAnswerDto,
    curUser: JwtPayload,
  ) {
    return `This action corrects answer ${answerId}`;
  }
}
