import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';
import { ExamHistory } from './entities/exam-history.entity';
import { ExamQuestion } from './entities/exam-question.entity';
import { ExamQuestionHistory } from './entities/exam-question-history.entity';
import { ExamStudent } from './entities/exam-student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam) private examRepo: Repository<Exam>,
    @InjectRepository(ExamHistory)
    private examHistoryRepo: Repository<ExamHistory>,
    @InjectRepository(ExamQuestion)
    private examQuestionRepo: Repository<ExamQuestion>,
    @InjectRepository(ExamQuestionHistory)
    private examQuestionHistoryRepo: Repository<ExamQuestionHistory>,
    @InjectRepository(ExamStudent)
    private examStudentRepo: Repository<ExamStudent>,
  ) {}

  create(createExamDto: CreateExamDto) {
    return 'This action adds a new exam';
  }

  findAll() {
    return `This action returns all exams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exam`;
  }

  update(id: number, updateExamDto: UpdateExamDto) {
    return `This action updates a #${id} exam`;
  }

  remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}
