import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
import { CreateExamStudentDto } from './dto/create-exam-student.dto';
import { Exam } from './entities/exam.entity';
import { ExamQuestion } from './entities/exam-question.entity';
import { ExamStudent } from './entities/exam-student.entity';
import { CourseClass } from '../course-classes/entities/course-class.entity';
import { Question } from '../questions/entities/question.entity';
import { Student } from '../users/entities/students.entity';
import { examCheckHandler } from '../helpers/exam-check.helper';

@Injectable()
export class ExamsService {
  private readonly logger = new Logger(ExamsService.name);

  constructor(
    @InjectRepository(Exam) private examRepo: Repository<Exam>,
    @InjectRepository(ExamQuestion)
    private examQuestionRepo: Repository<ExamQuestion>,
    @InjectRepository(ExamStudent)
    private examStudentRepo: Repository<ExamStudent>,
  ) {}

  // --- Exams ---

  async create(createExamDto: CreateExamDto) {
    const { courseClassId, ...attrs } = createExamDto;
    const exam = this.examRepo.create({
      ...attrs,
      courseClass: { id: courseClassId } as CourseClass,
    });

    try {
      const saveResult = await this.examRepo.save(exam);

      this.logger.log(
        `Exam with id ${saveResult.id} has been created and saved successfully`,
      );
      return saveResult;
    } catch (error) {
      throw examCheckHandler(error, 'Exam');
    }
  }

  findAll() {
    return this.examRepo.find({ relations: { courseClass: true } });
  }

  async findOne(id: number) {
    const exam = await this.examRepo.findOne({
      where: { id },
      relations: { courseClass: true },
    });

    if (!exam) {
      this.logger.warn(`Exam with id ${id} is not found`);
      throw new NotFoundException('exam not found');
    }
    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.findOne(id);
    const { courseClassId, ...attrs } = updateExamDto;

    Object.assign(exam, attrs);
    if (courseClassId !== undefined)
      exam.courseClass = { id: courseClassId } as CourseClass;

    try {
      const saveResult = await this.examRepo.save(exam);

      this.logger.log(`Exam with id ${id} has been updated successfully`);
      return saveResult;
    } catch (error) {
      throw examCheckHandler(error, 'Exam');
    }
  }

  async remove(id: number) {
    const exam = await this.findOne(id);
    const removeResult = await this.examRepo.remove(exam);

    this.logger.log(`Exam with id ${id} has been removed successfully`);
    return removeResult;
  }

  // --- Exam Questions ---

  async createExamQuestion(
    examId: number,
    createExamQuestionDto: CreateExamQuestionDto,
  ) {
    const examQuestion = this.examQuestionRepo.create({
      exam: { id: examId } as Exam,
      question: { id: createExamQuestionDto.questionId } as Question,
      degree: createExamQuestionDto.degree,
    });
    const saveResult = await this.examQuestionRepo.save(examQuestion);

    this.logger.log(
      `ExamQuestion with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAllExamQuestions(examId: number) {
    return this.examQuestionRepo.find({
      where: { exam: { id: examId } },
      relations: { question: true },
    });
  }

  async findOneExamQuestion(id: number) {
    const examQuestion = await this.examQuestionRepo.findOne({
      where: { id },
      relations: { exam: true, question: true },
    });

    if (!examQuestion) {
      this.logger.warn(`ExamQuestion with id ${id} is not found`);
      throw new NotFoundException('exam question not found');
    }
    return examQuestion;
  }

  async updateExamQuestion(
    id: number,
    updateExamQuestionDto: UpdateExamQuestionDto,
  ) {
    const examQuestion = await this.findOneExamQuestion(id);
    const { questionId, ...attrs } = updateExamQuestionDto;

    Object.assign(examQuestion, attrs);
    if (questionId !== undefined)
      examQuestion.question = { id: questionId } as Question;
    const saveResult = await this.examQuestionRepo.save(examQuestion);

    this.logger.log(
      `ExamQuestion with id ${id} has been updated successfully`,
    );
    return saveResult;
  }

  async removeExamQuestion(id: number) {
    const examQuestion = await this.findOneExamQuestion(id);
    const removeResult = await this.examQuestionRepo.remove(examQuestion);

    this.logger.log(
      `ExamQuestion with id ${id} has been removed successfully`,
    );
    return removeResult;
  }

  // --- Exam Students ---

  async createExamStudent(
    examId: number,
    createExamStudentDto: CreateExamStudentDto,
  ) {
    const examStudent = this.examStudentRepo.create({
      exam: { id: examId } as Exam,
      student: { id: createExamStudentDto.studentId } as Student,
    });
    const saveResult = await this.examStudentRepo.save(examStudent);

    this.logger.log(
      `ExamStudent with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAllExamStudents(examId: number) {
    return this.examStudentRepo.find({
      where: { exam: { id: examId } },
      relations: { student: true },
    });
  }

  async findOneExamStudent(id: number) {
    const examStudent = await this.examStudentRepo.findOne({
      where: { id },
      relations: { exam: true, student: true },
    });

    if (!examStudent) {
      this.logger.warn(`ExamStudent with id ${id} is not found`);
      throw new NotFoundException('exam student not found');
    }
    return examStudent;
  }

  async removeExamStudent(id: number) {
    const examStudent = await this.findOneExamStudent(id);
    const removeResult = await this.examStudentRepo.remove(examStudent);

    this.logger.log(`ExamStudent with id ${id} has been removed successfully`);
    return removeResult;
  }
}
