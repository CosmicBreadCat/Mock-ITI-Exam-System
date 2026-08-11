import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exam } from './exam.entity';
import { Question } from '../../questions/entities/question.entity';
import { ExamQuestionHistory } from './exam-question-history.entity';

@Entity()
@Unique(['exam', 'question'])
export class ExamQuestion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  degree!: number;

  @OneToMany(
    () => ExamQuestionHistory,
    (examQuestionHistory) => examQuestionHistory.examQuestion,
  )
  examQuestionHistories!: ExamQuestionHistory[];

  @ManyToOne(() => Exam, (exam) => exam.examQuestions, {
    onDelete: 'CASCADE',
  })
  exam!: Exam;

  @ManyToOne(() => Question, (question) => question.examQuestions, {
    onDelete: 'RESTRICT',
  })
  question!: Question;
}
