import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const question = this.questionRepo.create(createQuestionDto);
    const saveResult = await this.questionRepo.save(question);

    this.logger.log(
      `Question with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAll() {
    return this.questionRepo.find();
  }

  async findOne(id: number) {
    const question = await this.questionRepo.findOneBy({ id });

    if (!question) {
      this.logger.warn(`Question with id ${id} is not found`);
      throw new NotFoundException('question not found');
    }
    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.findOne(id);

    Object.assign(question, updateQuestionDto);
    const saveResult = await this.questionRepo.save(question);

    this.logger.log(`Question with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const question = await this.findOne(id);
    const removeResult = await this.questionRepo.remove(question);

    this.logger.log(`Question with id ${id} has been removed successfully`);
    return removeResult;
  }
}
