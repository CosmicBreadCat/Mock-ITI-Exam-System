import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
import { CreateExamStudentDto } from './dto/create-exam-student.dto';
import { RequireRole } from '../decorators/require-role.decorator';
import { UserRole } from '../users/entities/users.entity';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  // --- Exams ---

  @Post()
  @RequireRole(UserRole.Instructor)
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(+id);
  }

  @Patch(':id')
  @RequireRole(UserRole.Instructor)
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(+id, updateExamDto);
  }

  @Delete(':id')
  @RequireRole(UserRole.Instructor)
  remove(@Param('id') id: string) {
    return this.examsService.remove(+id);
  }

  // --- Exam Questions ---

  @Post(':id/questions')
  @RequireRole(UserRole.Instructor)
  createExamQuestion(
    @Param('id') id: string,
    @Body() createExamQuestionDto: CreateExamQuestionDto,
  ) {
    return this.examsService.createExamQuestion(+id, createExamQuestionDto);
  }

  @Get(':id/questions')
  @RequireRole(UserRole.Instructor)
  findAllExamQuestions(@Param('id') id: string) {
    return this.examsService.findAllExamQuestions(+id);
  }

  @Get(':id/questions/:examQuestionId')
  @RequireRole(UserRole.Instructor)
  findOneExamQuestion(@Param('examQuestionId') examQuestionId: string) {
    return this.examsService.findOneExamQuestion(+examQuestionId);
  }

  @Patch(':id/questions/:examQuestionId')
  @RequireRole(UserRole.Instructor)
  updateExamQuestion(
    @Param('examQuestionId') examQuestionId: string,
    @Body() updateExamQuestionDto: UpdateExamQuestionDto,
  ) {
    return this.examsService.updateExamQuestion(
      +examQuestionId,
      updateExamQuestionDto,
    );
  }

  @Delete(':id/questions/:examQuestionId')
  @RequireRole(UserRole.Instructor)
  removeExamQuestion(@Param('examQuestionId') examQuestionId: string) {
    return this.examsService.removeExamQuestion(+examQuestionId);
  }

  // --- Exam Students ---

  @Post(':id/students')
  @RequireRole(UserRole.Instructor)
  createExamStudent(
    @Param('id') id: string,
    @Body() createExamStudentDto: CreateExamStudentDto,
  ) {
    return this.examsService.createExamStudent(+id, createExamStudentDto);
  }

  @Get(':id/students')
  @RequireRole(UserRole.Instructor)
  findAllExamStudents(@Param('id') id: string) {
    return this.examsService.findAllExamStudents(+id);
  }

  @Get(':id/students/:examStudentId')
  @RequireRole(UserRole.Instructor)
  findOneExamStudent(@Param('examStudentId') examStudentId: string) {
    return this.examsService.findOneExamStudent(+examStudentId);
  }

  @Delete(':id/students/:examStudentId')
  @RequireRole(UserRole.Instructor)
  removeExamStudent(@Param('examStudentId') examStudentId: string) {
    return this.examsService.removeExamStudent(+examStudentId);
  }
}
