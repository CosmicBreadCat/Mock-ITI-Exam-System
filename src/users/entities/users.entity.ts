import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import type { Student } from './students.entity';
import type { Instructor } from './instructor.entity';

export enum UserRole {
  Student = 'Student',
  Instructor = 'Instructor',
  Manager = 'TrainingManager',
  Admin = 'Admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @IsEmail()
  @Column({ length: 100, unique: true })
  email!: string;

  @Exclude()
  @Column({ length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Student,
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Not persisted columns, populated on read by UsersService.attachProfile based on role.
  // Manager/Admin have no profile table so they have nothing to attach here, added note for future implementation.
  student?: Student;
  instructor?: Instructor;
}
