import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExamStudent } from './exam-student.entity';
import { ExamQuestionHistory } from './exam-question-history.entity';

export enum ExamHistoryStatus {
  InProgress = 'InProgress',
  Submitted = 'Submitted',
  Reviewed = 'Reviewed',
}

@Entity()
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

  @Column({ type: 'timestamptz' })
  endTime!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  submittedAt?: Date;

  @OneToMany(
    () => ExamQuestionHistory,
    (examQuestionHistory) => examQuestionHistory.examHistory,
  )
  examQuestionHistories!: ExamQuestionHistory[];

  @OneToOne(() => ExamStudent, (examStudent) => examStudent.examHistory, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  examStudent!: ExamStudent;
}
