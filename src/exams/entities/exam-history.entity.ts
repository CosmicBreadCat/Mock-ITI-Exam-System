import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ExamStudent } from './exam-student.entity';
import { ExamQuestionHistory } from './exam-question-history.entity';

@Entity()
@Unique(['examStudent', 'attempt'])
export class ExamHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  degree!: number;

  @Column({ type: 'int' })
  attempt!: number;

  @OneToMany(
    () => ExamQuestionHistory,
    (examQuestionHistory) => examQuestionHistory.examHistory,
  )
  examQuestionHistories!: ExamQuestionHistory[];

  @ManyToOne(() => ExamStudent, (examStudent) => examStudent.examHistories, {
    onDelete: 'RESTRICT',
  })
  examStudent!: ExamStudent;
}
