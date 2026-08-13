import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ExamQuestion } from './exam-question.entity';
import { ExamHistory } from './exam-history.entity';

@Entity()
@Unique(['examQuestion', 'examHistory'])
export class ExamQuestionHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  correct!: boolean;

  @Column()
  instructorCheck!: boolean;

  @Column({ type: 'int' })
  awardedDegree!: number;

  @Column({ length: 500 })
  answer!: string;

  @ManyToOne(
    () => ExamQuestion,
    (examQuestion) => examQuestion.examQuestionHistories,
    { onDelete: 'RESTRICT' },
  )
  examQuestion!: ExamQuestion;

  @ManyToOne(
    () => ExamHistory,
    (examHistory) => examHistory.examQuestionHistories,
    { onDelete: 'CASCADE' },
  )
  examHistory!: ExamHistory;
}
