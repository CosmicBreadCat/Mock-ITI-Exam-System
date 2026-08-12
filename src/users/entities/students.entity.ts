import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Track } from '../../tracks/entities/track.entity';
import { Branch } from '../../branches/entities/branch.entity';
import { Intake } from '../../intakes/entities/intake.entity';
import { CourseClassStudent } from '../../course-classes/entities/course-class-student.entity';
import { ExamStudent } from '../../exams/entities/exam-student.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @OneToMany(
    () => CourseClassStudent,
    (courseClassStudent) => courseClassStudent.student,
  )
  courseClassStudents!: CourseClassStudent[];

  @OneToMany(() => ExamStudent, (examStudent) => examStudent.student)
  examStudents!: ExamStudent[];

  @ManyToOne(() => Track, (track) => track.students, {
    onDelete: 'RESTRICT',
  })
  track!: Track;

  @ManyToOne(() => Branch, (branch) => branch.students, {
    onDelete: 'RESTRICT',
  })
  branch!: Branch;

  @ManyToOne(() => Intake, (intake) => intake.students, {
    onDelete: 'RESTRICT',
  })
  intake!: Intake;
}
