import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ExamAttemptsService } from './exam-attempts.service';
import { SubmitExamAttemptDto } from './dto/submit-exam-attempt.dto';
import { CorrectExamAnswerDto } from './dto/correct-exam-answer.dto';
import { RequireRole } from '../decorators/require-role.decorator';
import { UserRole } from '../users/entities/users.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('exams/:examId/attempts')
export class ExamAttemptsController {
  constructor(private readonly examAttemptsService: ExamAttemptsService) {}

  @Get()
  @RequireRole(UserRole.Student, UserRole.Instructor)
  findAllAttempts(
    @Param('examId') examId: string,
    @CurrentUser() curUser: JwtPayload,
  ) {
    return this.examAttemptsService.findAllAttempts(+examId, curUser);
  }

  @Get(':attemptId')
  @RequireRole(UserRole.Student, UserRole.Instructor)
  findOneAttempt(
    @Param('attemptId') attemptId: string,
    @CurrentUser() curUser: JwtPayload,
  ) {
    return this.examAttemptsService.findOneAttempt(+attemptId, curUser);
  }

  @Post()
  @RequireRole(UserRole.Student)
  start(@Param('examId') examId: string, @CurrentUser() curUser: JwtPayload) {
    return this.examAttemptsService.start(+examId, curUser);
  }

  @Post(':attemptId/submit')
  @RequireRole(UserRole.Student)
  submit(
    @Param('attemptId') attemptId: string,
    @Body() submitExamAttemptDto: SubmitExamAttemptDto,
    @CurrentUser() curUser: JwtPayload,
  ) {
    return this.examAttemptsService.submit(
      +attemptId,
      submitExamAttemptDto,
      curUser,
    );
  }

  @Patch(':attemptId/answers/:answerId')
  @RequireRole(UserRole.Instructor)
  correctAnswer(
    @Param('answerId') answerId: string,
    @Body() correctExamAnswerDto: CorrectExamAnswerDto,
    @CurrentUser() curUser: JwtPayload,
  ) {
    return this.examAttemptsService.correctAnswer(
      +answerId,
      correctExamAnswerDto,
      curUser,
    );
  }

  @Patch(':attemptId/review')
  @RequireRole(UserRole.Instructor)
  reviewAttempt(
    @Param('attemptId') attemptId: string,
    @CurrentUser() curUser: JwtPayload,
  ) {
    return this.examAttemptsService.reviewAttempt(+attemptId, curUser);
  }
}
