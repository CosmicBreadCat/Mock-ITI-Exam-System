import {
  Check,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseClass } from '../../course-classes/entities/course-class.entity';
import { ExamQuestion } from './exam-question.entity';
import { ExamStudent } from './exam-student.entity';

export enum ExamType {
  Normal = 'Normal',
  Corrective = 'Corrective',
}

@Entity()
@Check('end_time > start_time')
@Check('min_degree > 0')
@Check('max_degree > min_degree')
@Check('late_entry_min >= 0 AND late_entry_min <= 60')
@Check('grace_period_min >= 0 AND grace_period_min <= 60')
@Check('max_attempts >= 0 AND max_attempts <= 5')
@Check('retake_cooldown_min >= 0 AND retake_cooldown_min <= 60')
export class Exam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'enum', enum: ExamType, default: ExamType.Normal })
  type!: ExamType;

  @Column({ type: 'timestamptz' })
  startTime!: Date;

  @Column({ type: 'timestamptz' })
  endTime!: Date;

  @Column({
    type: 'int',
    asExpression: `(EXTRACT(EPOCH FROM ("end_time" - "start_time")) / 60)::int`,
    generatedType: 'STORED',
  })
  totalTimeMin!: number;

  @Column({ type: 'int' })
  minDegree!: number;

  @Column({ type: 'int' })
  maxDegree!: number;

  @Column({ type: 'int', default: 0 })
  lateEntryMin!: number;

  @Column({ type: 'int', default: 0 })
  gracePeriodMin!: number;

  @Column({ type: 'int', default: 0 })
  maxAttempts!: number;

  @Column({ type: 'int', default: 0 })
  retakeCooldownMin!: number;

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.exam)
  examQuestions!: ExamQuestion[];

  @OneToMany(() => ExamStudent, (examStudent) => examStudent.exam)
  examStudents!: ExamStudent[];

  @ManyToOne(() => CourseClass, (courseClass) => courseClass.exams, {
    onDelete: 'CASCADE',
  })
  courseClass!: CourseClass;
}
