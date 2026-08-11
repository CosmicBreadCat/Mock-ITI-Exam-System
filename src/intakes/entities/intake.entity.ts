import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../../users/entities/students.entity';
import { CourseClass } from '../../course-classes/entities/course-class.entity';

@Entity()
export class Intake {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @OneToMany(() => Student, (student) => student.intake)
  students!: Student[];

  @OneToMany(() => CourseClass, (courseClass) => courseClass.intake)
  courseClasses!: CourseClass[];
}
