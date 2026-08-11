import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Instructor } from '../../users/entities/instructor.entity';
import { CourseClassStudent } from './course-class-student.entity';
import { Course } from '../../courses/entities/course.entity';
import { Track } from '../../tracks/entities/track.entity';
import { Branch } from '../../branches/entities/branch.entity';
import { Intake } from '../../intakes/entities/intake.entity';
import { Exam } from '../../exams/entities/exam.entity';

@Entity()
export class CourseClass {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(
    () => CourseClassStudent,
    (courseClassStudent) => courseClassStudent.courseClass,
  )
  courseClassStudents!: CourseClassStudent[];

  @OneToMany(() => Exam, (exam) => exam.courseClass)
  exams!: Exam[];

  @ManyToOne(() => Course, (course) => course.courseClasses, {
    onDelete: 'RESTRICT',
  })
  course!: Course;

  @ManyToOne(() => Track, (track) => track.courseClasses, {
    onDelete: 'RESTRICT',
  })
  track!: Track;

  @ManyToOne(() => Branch, (branch) => branch.courseClasses, {
    onDelete: 'RESTRICT',
  })
  branch!: Branch;

  @ManyToOne(() => Intake, (intake) => intake.courseClasses, {
    onDelete: 'RESTRICT',
  })
  intake!: Intake;

  @ManyToOne(() => Instructor, (instructor) => instructor.courseClasses, {
    onDelete: 'RESTRICT',
  })
  instructor!: Instructor;
}
