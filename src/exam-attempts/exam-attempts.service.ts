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

  findAllAttempts(examId: number, curUser: JwtPayload) {
    return `This action returns exam ${examId}'s attempts, scoped to the current student or, for an instructor, all attempts of students in their exam`;
  }

  findOneAttempt(attemptId: number, curUser: JwtPayload) {
    return `This action returns attempt ${attemptId}'s full history with all question history records, including correct answers if requested by an instructor`;
  }

  start(examId: number, curUser: JwtPayload) {
    return `This action starts a new attempt for exam ${examId}`;
  }

  submit(
    attemptId: number,
    submitExamAttemptDto: SubmitExamAttemptDto,
    curUser: JwtPayload,
  ) {
    return `This action submits, corrects and stores attempt ${attemptId}`;
  }

  correctAnswer(
    answerId: number,
    correctExamAnswerDto: CorrectExamAnswerDto,
    curUser: JwtPayload,
  ) {
    return `This action corrects answer ${answerId}`;
  }

  reviewAttempt(attemptId: number, curUser: JwtPayload) {
    return `This action marks attempt ${attemptId} as reviewed`;
  }

  private correctAttempt(attemptId: number) {
    return `This action corrects attempt ${attemptId}'s question history records against the exam's correct answers`;
  }
}
