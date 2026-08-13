import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseClassDto } from './dto/create-course-class.dto';
import { UpdateCourseClassDto } from './dto/update-course-class.dto';
import { CreateCourseClassStudentDto } from './dto/create-course-class-student.dto';
import { UpdateCourseClassStudentDto } from './dto/update-course-class-student.dto';
import { CourseClass } from './entities/course-class.entity';
import { CourseClassStudent } from './entities/course-class-student.entity';
import { Course } from '../courses/entities/course.entity';
import { Track } from '../tracks/entities/track.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Intake } from '../intakes/entities/intake.entity';
import { Instructor } from '../users/entities/instructor.entity';
import { Student } from '../users/entities/students.entity';
import { UserRole } from '../users/entities/users.entity';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class CourseClassesService {
  private readonly logger = new Logger(CourseClassesService.name);

  constructor(
    @InjectRepository(CourseClass)
    private courseClassRepo: Repository<CourseClass>,
    @InjectRepository(CourseClassStudent)
    private courseClassStudentRepo: Repository<CourseClassStudent>,
  ) {}

  // --- Course Classes ---

  async create(createCourseClassDto: CreateCourseClassDto) {
    const courseClass = this.courseClassRepo.create({
      course: { id: createCourseClassDto.courseId } as Course,
      instructor: { id: createCourseClassDto.instructorId } as Instructor,
      intake: { id: createCourseClassDto.intakeId } as Intake,
      branch: { id: createCourseClassDto.branchId } as Branch,
      track: { id: createCourseClassDto.trackId } as Track,
    });
    const saveResult = await this.courseClassRepo.save(courseClass);

    this.logger.log(
      `CourseClass with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAll(curUser: JwtPayload) {
    const relations = {
      course: true,
      instructor: true,
      intake: true,
      branch: true,
      track: true,
    };

    if (curUser.role === UserRole.Manager || curUser.role === UserRole.Admin)
      return this.courseClassRepo.find({ relations });

    if (curUser.role === UserRole.Instructor)
      return this.courseClassRepo.find({
        where: { instructor: { user: { id: curUser.sub } } },
        relations,
      });

    return this.courseClassRepo.find({
      where: { courseClassStudents: { student: { user: { id: curUser.sub } } } },
      relations,
    });
  }

  async findOne(id: number, curUser?: JwtPayload) {
    const courseClass = await this.courseClassRepo.findOne({
      where: { id },
      relations: {
        course: true,
        instructor: { user: true },
        intake: true,
        branch: true,
        track: true,
      },
    });

    if (!courseClass) {
      this.logger.warn(`CourseClass with id ${id} is not found`);
      throw new NotFoundException('course class not found');
    }

    if (curUser?.role === UserRole.Instructor)
      this.assertInstructorOwnsCourseClass(courseClass, curUser);
    if (curUser?.role === UserRole.Student)
      await this.assertStudentEnrolled(id, curUser);

    return courseClass;
  }

  private assertInstructorOwnsCourseClass(
    courseClass: CourseClass,
    curUser: JwtPayload,
  ) {
    if (courseClass.instructor.user.id !== curUser.sub) {
      this.logger.warn(
        `User ${curUser.sub} attempted to access a course class they do not teach`,
      );
      throw new ForbiddenException('No permission to access this course class');
    }
  }

  private async assertStudentEnrolled(courseClassId: number, curUser: JwtPayload) {
    const enrollment = await this.courseClassStudentRepo.findOneBy({
      courseClass: { id: courseClassId },
      student: { user: { id: curUser.sub } },
    });

    if (!enrollment) {
      this.logger.warn(
        `User ${curUser.sub} attempted to access a course class they are not enrolled in`,
      );
      throw new ForbiddenException('No permission to access this course class');
    }
  }

  async update(id: number, updateCourseClassDto: UpdateCourseClassDto) {
    const courseClass = await this.findOne(id);
    const { courseId, instructorId, intakeId, branchId, trackId } =
      updateCourseClassDto;

    if (courseId !== undefined) courseClass.course = { id: courseId } as Course;
    if (instructorId !== undefined)
      courseClass.instructor = { id: instructorId } as Instructor;
    if (intakeId !== undefined) courseClass.intake = { id: intakeId } as Intake;
    if (branchId !== undefined) courseClass.branch = { id: branchId } as Branch;
    if (trackId !== undefined) courseClass.track = { id: trackId } as Track;

    const saveResult = await this.courseClassRepo.save(courseClass);

    this.logger.log(`CourseClass with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const courseClass = await this.findOne(id);
    const removeResult = await this.courseClassRepo.remove(courseClass);

    this.logger.log(`CourseClass with id ${id} has been removed successfully`);
    return removeResult;
  }

  // --- Course Class Students ---

  async createCourseClassStudent(
    courseClassId: number,
    createCourseClassStudentDto: CreateCourseClassStudentDto,
  ) {
    const courseClassStudent = this.courseClassStudentRepo.create({
      courseClass: { id: courseClassId } as CourseClass,
      student: { id: createCourseClassStudentDto.studentId } as Student,
    });
    const saveResult =
      await this.courseClassStudentRepo.save(courseClassStudent);

    this.logger.log(
      `CourseClassStudent with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  async findAllCourseClassStudents(courseClassId: number, curUser: JwtPayload) {
    if (curUser.role === UserRole.Instructor) {
      const courseClass = await this.findOne(courseClassId);
      this.assertInstructorOwnsCourseClass(courseClass, curUser);
    }

    return this.courseClassStudentRepo.find({
      where: { courseClass: { id: courseClassId } },
      relations: {
        student: { user: true, track: true, branch: true, intake: true },
      },
    });
  }

  async findOneCourseClassStudent(id: number, curUser?: JwtPayload) {
    const courseClassStudent = await this.courseClassStudentRepo.findOne({
      where: { id },
      relations: {
        courseClass: { instructor: { user: true } },
        student: { user: true, track: true, branch: true, intake: true },
      },
    });

    if (!courseClassStudent) {
      this.logger.warn(`CourseClassStudent with id ${id} is not found`);
      throw new NotFoundException('course class student not found');
    }

    if (curUser?.role === UserRole.Instructor)
      this.assertInstructorOwnsCourseClass(
        courseClassStudent.courseClass,
        curUser,
      );

    return courseClassStudent;
  }

  async updateCourseClassStudent(
    id: number,
    updateCourseClassStudentDto: UpdateCourseClassStudentDto,
  ) {
    const courseClassStudent = await this.findOneCourseClassStudent(id);
    const { studentId } = updateCourseClassStudentDto;

    if (studentId !== undefined)
      courseClassStudent.student = { id: studentId } as Student;

    const saveResult =
      await this.courseClassStudentRepo.save(courseClassStudent);

    this.logger.log(
      `CourseClassStudent with id ${id} has been updated successfully`,
    );
    return saveResult;
  }

  async removeCourseClassStudent(id: number) {
    const courseClassStudent = await this.findOneCourseClassStudent(id);
    const removeResult =
      await this.courseClassStudentRepo.remove(courseClassStudent);

    this.logger.log(
      `CourseClassStudent with id ${id} has been removed successfully`,
    );
    return removeResult;
  }
}
