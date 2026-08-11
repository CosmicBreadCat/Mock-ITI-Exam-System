import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Student } from '../../users/entities/students.entity';
import { CourseClass } from './course-class.entity';

@Entity()
@Unique(['courseClass', 'student'])
export class CourseClassStudent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => CourseClass,
    (courseClass) => courseClass.courseClassStudents,
    {
      onDelete: 'RESTRICT',
    },
  )
  courseClass!: CourseClass;

  @ManyToOne(() => Student, (student) => student.courseClassStudents, {
    onDelete: 'RESTRICT',
  })
  student!: Student;
}
