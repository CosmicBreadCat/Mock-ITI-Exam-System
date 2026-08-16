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
@Check('pass_degree >= min_degree AND pass_degree <= max_degree')
@Check('session_duration_min > 0')
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
  windowDurationMin!: number;

  @Column({ type: 'int' })
  minDegree!: number;

  @Column({ type: 'int' })
  maxDegree!: number;

  @Column({ type: 'int' })
  passDegree!: number;

  @Column({ type: 'int' })
  sessionDurationMin!: number;

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.exam)
  examQuestions!: ExamQuestion[];

  @OneToMany(() => ExamStudent, (examStudent) => examStudent.exam)
  examStudents!: ExamStudent[];

  @ManyToOne(() => CourseClass, (courseClass) => courseClass.exams, {
    onDelete: 'CASCADE',
  })
  courseClass!: CourseClass;
}
