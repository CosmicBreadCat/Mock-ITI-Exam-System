import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ExamHistory,
  ExamHistoryStatus,
} from '../exams/entities/exam-history.entity';
import { ExamQuestionHistory } from '../exams/entities/exam-question-history.entity';
import { ExamStudent } from '../exams/entities/exam-student.entity';
import { ExamsService } from '../exams/exams.service';
import { Question, QuestionType } from '../questions/entities/question.entity';
import { UserRole } from '../users/entities/users.entity';
import { SubmitExamAttemptDto } from './dto/submit-exam-attempt.dto';
import { CorrectExamAnswerDto } from './dto/correct-exam-answer.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ExamAttemptsService {
  private readonly logger = new Logger(ExamAttemptsService.name);

  constructor(
    @InjectRepository(ExamHistory)
    private examHistoryRepo: Repository<ExamHistory>,
    @InjectRepository(ExamQuestionHistory)
    private examQuestionHistoryRepo: Repository<ExamQuestionHistory>,
    @InjectRepository(ExamStudent)
    private examStudentRepo: Repository<ExamStudent>,
    private examsService: ExamsService,
  ) {}

  findAllAttempts(examId: number, curUser: JwtPayload) {
    const relations = { examStudent: { student: { user: true } } };

    if (curUser.role === UserRole.Instructor)
      return this.examHistoryRepo.find({
        where: {
          exam: {
            id: examId,
            courseClass: { instructor: { user: { id: curUser.sub } } },
          },
        },
        relations,
      });

    return this.examHistoryRepo.find({
      where: {
        exam: { id: examId },
        examStudent: { student: { user: { id: curUser.sub } } },
      },
      relations,
    });
  }

  async findOneAttempt(examId: number, attemptId: number, curUser: JwtPayload) {
    const examHistory = await this.examHistoryRepo.findOne({
      where: { id: attemptId },
      relations: {
        examStudent: { student: { user: true } },
        exam: { courseClass: { instructor: { user: true } } },
        examQuestionHistories: { examQuestion: { question: true } },
      },
    });

    if (!examHistory || examHistory.exam.id !== examId) {
      this.logger.warn(`ExamHistory with id ${attemptId} is not found`);
      throw new NotFoundException('exam attempt not found');
    }

    if (curUser.role === UserRole.Student)
      this.assertStudentOwnsAttempt(examHistory, curUser);
    if (curUser.role === UserRole.Instructor)
      this.assertInstructorOwnsAttempt(examHistory, curUser);

    if (curUser.role === UserRole.Student)
      for (const examQuestionHistory of examHistory.examQuestionHistories)
        delete (examQuestionHistory.examQuestion.question as Partial<Question>)
          .correctAnswer;

    return examHistory;
  }

  async getExamQuestions(examId: number, curUser: JwtPayload) {
    await this.assertActiveAttempt(examId, curUser);

    const examQuestions = await this.examsService.findAllExamQuestions(examId);
    for (const examQuestion of examQuestions)
      delete (examQuestion.question as Partial<Question>).correctAnswer;

    return examQuestions;
  }

  async start(examId: number, curUser: JwtPayload) {
    const examStudent = await this.examStudentRepo.findOne({
      where: { exam: { id: examId }, student: { user: { id: curUser.sub } } },
      relations: { exam: true, examHistory: true },
    });

    if (!examStudent) {
      this.logger.warn(
        `User ${curUser.sub} attempted to start exam ${examId} they are not enrolled in`,
      );
      throw new ForbiddenException('No permission to access this exam');
    }

    const now = new Date();
    if (now < examStudent.exam.startTime || now > examStudent.exam.endTime)
      throw new BadRequestException(
        'This exam is not currently open for starting',
      );

    if (examStudent.examHistory)
      throw new ConflictException(
        'An attempt for this exam has already been started',
      );

    const examHistory = this.examHistoryRepo.create({
      examStudent,
      exam: examStudent.exam,
      startTime: now,
      endTime: new Date(
        now.getTime() + examStudent.exam.sessionDurationMin * 60_000,
      ),
      status: ExamHistoryStatus.InProgress,
    });
    const saveResult = await this.examHistoryRepo.save(examHistory);

    this.logger.log(
      `ExamHistory with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  async submit(
    examId: number,
    attemptId: number,
    submitExamAttemptDto: SubmitExamAttemptDto,
    curUser: JwtPayload,
  ) {
    const examHistory = await this.examHistoryRepo.findOne({
      where: { id: attemptId },
      relations: { examStudent: { student: { user: true } }, exam: true },
    });

    if (!examHistory || examHistory.exam.id !== examId) {
      this.logger.warn(`ExamHistory with id ${attemptId} is not found`);
      throw new NotFoundException('exam attempt not found');
    }

    this.assertStudentOwnsAttempt(examHistory, curUser);

    if (examHistory.status !== ExamHistoryStatus.InProgress)
      throw new BadRequestException(
        'This exam attempt has already been submitted',
      );

    if (new Date() > examHistory.endTime)
      throw new BadRequestException(
        'The time allowed for this exam attempt has ended',
      );

    const examQuestions = await this.examsService.findAllExamQuestions(examId);

    examHistory.degree = await this.correctAttempt(
      examHistory,
      submitExamAttemptDto.answers,
      examQuestions,
    );
    examHistory.submittedAt = new Date();
    examHistory.status = ExamHistoryStatus.Submitted;

    const saveResult = await this.examHistoryRepo.save(examHistory);

    this.logger.log(
      `ExamHistory with id ${attemptId} has been submitted, corrected and stored successfully`,
    );
    return saveResult;
  }

  async correctAnswer(
    examId: number,
    answerId: number,
    correctExamAnswerDto: CorrectExamAnswerDto,
    curUser: JwtPayload,
  ) {
    const examQuestionHistory = await this.examQuestionHistoryRepo.findOne({
      where: { id: answerId },
      relations: {
        examQuestion: true,
        examHistory: { exam: { courseClass: { instructor: { user: true } } } },
      },
    });

    if (
      !examQuestionHistory ||
      examQuestionHistory.examHistory.exam.id !== examId
    ) {
      this.logger.warn(`ExamQuestionHistory with id ${answerId} is not found`);
      throw new NotFoundException('exam answer not found');
    }

    this.assertInstructorOwnsAttempt(examQuestionHistory.examHistory, curUser);

    if (
      correctExamAnswerDto.awardedDegree >
      examQuestionHistory.examQuestion.degree
    )
      throw new BadRequestException(
        `Awarded degree cannot exceed the question's degree of ${examQuestionHistory.examQuestion.degree}`,
      );

    examQuestionHistory.awardedDegree = correctExamAnswerDto.awardedDegree;
    examQuestionHistory.correct =
      correctExamAnswerDto.awardedDegree ===
      examQuestionHistory.examQuestion.degree;
    examQuestionHistory.instructorCheck = true;

    const saveResult =
      await this.examQuestionHistoryRepo.save(examQuestionHistory);

    saveResult.examHistory.degree = await this.recomputeDegree(
      saveResult.examHistory.id,
    );
    await this.examHistoryRepo.save(saveResult.examHistory);

    this.logger.log(
      `ExamQuestionHistory with id ${answerId} has been corrected successfully`,
    );
    return saveResult;
  }

  async reviewAttempt(examId: number, attemptId: number, curUser: JwtPayload) {
    const examHistory = await this.examHistoryRepo.findOne({
      where: { id: attemptId },
      relations: { exam: { courseClass: { instructor: { user: true } } } },
    });

    if (!examHistory || examHistory.exam.id !== examId) {
      this.logger.warn(`ExamHistory with id ${attemptId} is not found`);
      throw new NotFoundException('exam attempt not found');
    }

    this.assertInstructorOwnsAttempt(examHistory, curUser);

    if (examHistory.status !== ExamHistoryStatus.Submitted)
      throw new BadRequestException(
        'Only submitted exam attempts can be reviewed',
      );

    examHistory.degree = await this.recomputeDegree(examHistory.id);
    examHistory.status = ExamHistoryStatus.Reviewed;

    const saveResult = await this.examHistoryRepo.save(examHistory);

    this.logger.log(
      `ExamHistory with id ${attemptId} has been marked as reviewed successfully`,
    );
    return saveResult;
  }

  private assertStudentOwnsAttempt(
    examHistory: ExamHistory,
    curUser: JwtPayload,
  ) {
    if (examHistory.examStudent.student.user.id !== curUser.sub) {
      this.logger.warn(
        `User ${curUser.sub} attempted to access an exam attempt that is not theirs`,
      );
      throw new ForbiddenException('No permission to access this exam attempt');
    }
  }

  private assertInstructorOwnsAttempt(
    examHistory: ExamHistory,
    curUser: JwtPayload,
  ) {
    if (examHistory.exam.courseClass.instructor.user.id !== curUser.sub) {
      this.logger.warn(
        `User ${curUser.sub} attempted to access an exam attempt they do not have permission for`,
      );
      throw new ForbiddenException('No permission to access this exam attempt');
    }
  }

  private async assertActiveAttempt(examId: number, curUser: JwtPayload) {
    const examStudent = await this.examStudentRepo.findOne({
      where: { exam: { id: examId }, student: { user: { id: curUser.sub } } },
      relations: { examHistory: true },
    });

    if (
      !examStudent?.examHistory ||
      examStudent.examHistory.status !== ExamHistoryStatus.InProgress ||
      new Date() > examStudent.examHistory.endTime
    ) {
      this.logger.warn(
        `User ${curUser.sub} attempted to access exam ${examId}'s questions without an active attempt`,
      );
      throw new ForbiddenException('No active exam attempt found');
    }
  }

  private async recomputeDegree(examHistoryId: number) {
    const examQuestionHistories = await this.examQuestionHistoryRepo.findBy({
      examHistory: { id: examHistoryId },
    });
    return examQuestionHistories.reduce(
      (sum, examQuestionHistory) => sum + examQuestionHistory.awardedDegree,
      0,
    );
  }

  private async correctAttempt(
    examHistory: ExamHistory,
    answers: SubmitExamAttemptDto['answers'],
    examQuestions: Awaited<ReturnType<ExamsService['findAllExamQuestions']>>,
  ) {
    const examQuestionsById = new Map(
      examQuestions.map((examQuestion) => [examQuestion.id, examQuestion]),
    );

    const examQuestionHistories = answers.map(({ examQuestionId, answer }) => {
      const examQuestion = examQuestionsById.get(examQuestionId);
      if (!examQuestion)
        throw new BadRequestException(
          `Question ${examQuestionId} does not belong to this exam`,
        );

      const correct =
        examQuestion.question.type !== QuestionType.Text &&
        examQuestion.question.correctAnswer === answer;

      return this.examQuestionHistoryRepo.create({
        examHistory,
        examQuestion,
        answer,
        correct,
        instructorCheck: false,
        awardedDegree: correct ? examQuestion.degree : 0,
      });
    });

    await this.examQuestionHistoryRepo.save(examQuestionHistories);

    return examQuestionHistories.reduce(
      (sum, examQuestionHistory) => sum + examQuestionHistory.awardedDegree,
      0,
    );
  }
}
