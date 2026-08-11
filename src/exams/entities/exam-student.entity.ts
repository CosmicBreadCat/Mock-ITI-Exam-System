import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exam } from './exam.entity';
import { Student } from '../../users/entities/students.entity';
import { ExamHistory } from './exam-history.entity';

@Entity()
@Unique(['student', 'exam'])
export class ExamStudent {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => ExamHistory, (examHistory) => examHistory.examStudent)
  examHistories!: ExamHistory[];

  @ManyToOne(() => Student, (student) => student.examStudents, {
    onDelete: 'RESTRICT',
  })
  student!: Student;

  @ManyToOne(() => Exam, (exam) => exam.examStudents, {
    onDelete: 'RESTRICT',
  })
  exam!: Exam;
}
