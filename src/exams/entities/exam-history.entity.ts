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

export enum ExamHistoryStatus {
  InProgress = 'InProgress',
  Submitted = 'Submitted',
  Reviewed = 'Reviewed',
}

@Entity()
@Unique(['examStudent', 'attempt'])
export class ExamHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: ExamHistoryStatus,
    default: ExamHistoryStatus.InProgress,
  })
  status!: ExamHistoryStatus;

  @Column({ type: 'int', nullable: true })
  degree?: number;

  @Column({ type: 'timestamptz' })
  startTime!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endTime?: Date;

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
