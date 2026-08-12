import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash as bcryptHash } from 'bcrypt';
import { User, UserRole } from './entities/users.entity';
import { Student } from './entities/students.entity';
import { Instructor } from './entities/instructor.entity';
import { Track } from '../tracks/entities/track.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Intake } from '../intakes/entities/intake.entity';
import { CreateAdminDto } from './dtos/create/create-admin.dto';
import { CreateInstructorDto } from './dtos/create/create-instructor.dto';
import { CreateManagerDto } from './dtos/create/create-manager.dto';
import { CreateStudentDto } from './dtos/create/create-student.dto';
import { UpdateInstructorDto } from './dtos/update/update-instructor.dto';
import { UpdateStudentDto } from './dtos/update/update-student.dto';
import { UpdateManagerDto } from './dtos/update/update-manager.dto';
import { UpdateAdminDto } from './dtos/update/update-admin.dto';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { FindUserDto } from './dtos/find-user.dto';

export type CreateUserRequest =
  CreateStudentDto | CreateInstructorDto | CreateManagerDto | CreateAdminDto;

export type UpdateUserRequest =
  UpdateStudentDto | UpdateInstructorDto | UpdateManagerDto | UpdateAdminDto;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Instructor)
    private instructorRepo: Repository<Instructor>,
  ) {}

  async create(curUser: JwtPayload, dto: CreateUserRequest) {
    if (curUser.role === UserRole.Manager && dto.role !== UserRole.Student)
      throw new ForbiddenException(
        'Training Manager can only create users of role student',
      );

    const user = await this.createUser(
      dto.name,
      dto.email,
      dto.password,
      dto.role,
    );
    switch (dto.role) {
      case UserRole.Student:
        if (dto instanceof CreateStudentDto) {
          const student = this.studentRepo.create({
            user,
            track: { id: dto.trackId },
            branch: { id: dto.branchId },
            intake: { id: dto.intakeId },
          });
          await this.studentRepo.save(student);

          this.logger.log(
            `Student with user_id ${user.id} has been created and saved successfully`,
          );
          return this.attachProfile(user);
        }
      case UserRole.Instructor:
        if (dto instanceof CreateInstructorDto) {
          const instructor = this.instructorRepo.create({
            user,
            salary: dto.salary,
          });
          await this.instructorRepo.save(instructor);

          this.logger.log(
            `Instructor with user_id ${user.id} has been created and saved successfully`,
          );
          return this.attachProfile(user);
        }
      case UserRole.Manager:
        if (dto instanceof CreateManagerDto) {
          this.logger.log(
            `Manager with user_id ${user.id} has been created and saved successfully`,
          );
          return this.attachProfile(user);
        }
      case UserRole.Admin:
        if (dto instanceof CreateAdminDto) {
          this.logger.log(
            `Admin with user_id ${user.id} has been created and saved successfully`,
          );
          return this.attachProfile(user);
        }
      default:
        throw new BadRequestException(
          'Something went wrong with account creation, bad role',
        );
    }
  }

  async findByEmail(email: string) {
    if (!email) return null;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) return null;
    return this.attachProfile(user);
  }

  async findOne(id: number, curUser?: JwtPayload) {
    if (!id) return null;
    const user = await this.userRepo.findOneBy({ id });
    if (!user) return null;

    if (curUser?.role === UserRole.Manager && user.role !== UserRole.Student) {
      throw new ForbiddenException(
        'Logged in user has no permission to view requested user',
      );
    }

    return this.attachProfile(user);
  }

  async findAll(curUser: JwtPayload, search?: FindUserDto) {
    if (search === undefined) search = {};

    const result = await this.userRepo.find({
      where: {
        email: search.email ?? undefined,
        name: search.name ?? undefined,
        role:
          curUser.role === UserRole.Manager
            ? UserRole.Student
            : (search.role ?? undefined),
      },
    });
    this.logger.debug(`User query is successful`);
    return result;
  }

  async update(user: User, dto: UpdateUserRequest) {
    switch (user.role) {
      case UserRole.Student:
        if (dto instanceof UpdateStudentDto) {
          await this.updateUser(user, {
            email: dto.email,
            name: dto.name,
            password: dto.password,
          });
          await this.updateStudentProfile(user.id, dto);

          this.logger.log(
            `User with id ${user.id} has been updated successfully`,
          );
          return this.attachProfile(user);
        }
      case UserRole.Instructor:
        if (dto instanceof UpdateInstructorDto) {
          await this.updateUser(user, {
            email: dto.email,
            name: dto.name,
            password: dto.password,
          });
          await this.updateInstructorProfile(user.id, dto);

          this.logger.log(
            `User with id ${user.id} has been updated successfully`,
          );
          return this.attachProfile(user);
        }
      case UserRole.Manager:
        if (dto instanceof UpdateManagerDto) {
          await this.updateUser(user, {
            email: dto.email,
            name: dto.name,
            password: dto.password,
          });

          this.logger.log(
            `User with id ${user.id} has been updated successfully`,
          );
          return this.attachProfile(user);
        }
      case UserRole.Admin:
        if (dto instanceof UpdateAdminDto) {
          await this.updateUser(user, {
            email: dto.email,
            name: dto.name,
            password: dto.password,
          });

          this.logger.log(
            `User with id ${user.id} has been updated successfully`,
          );
          return this.attachProfile(user);
        }
      default:
        throw new BadRequestException(
          'Something went wrong with account update',
        );
    }
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      this.logger.warn(`User with id ${id} is not found in user remove.`);
      throw new NotFoundException('user not found');
    }

    const removeResult = await this.userRepo.remove(user);

    this.logger.log(`User with id ${id} has been removed successfully`);
    return removeResult;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return bcryptHash(password, salt);
  }

  private async createUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    const user = this.userRepo.create({
      name,
      email,
      role,
      password: await this.hashPassword(password),
    });
    const saveResult = await this.userRepo.save(user);

    return saveResult;
  }

  private async updateUser(user: User, attrs: Partial<User>) {
    if (attrs.password) {
      attrs.password = await this.hashPassword(attrs.password);
    }
    Object.assign(user, attrs);
    const saveResult = await this.userRepo.save(user);

    return saveResult;
  }

  private async updateStudentProfile(userId: number, dto: UpdateStudentDto) {
    if (
      dto.trackId === undefined &&
      dto.branchId === undefined &&
      dto.intakeId === undefined
    ) {
      return;
    }

    const student = await this.studentRepo.findOneBy({
      user: { id: userId },
    });
    if (!student) {
      throw new NotFoundException('student profile not found');
    }

    if (dto.trackId !== undefined) student.track = { id: dto.trackId } as Track;
    if (dto.branchId !== undefined)
      student.branch = { id: dto.branchId } as Branch;
    if (dto.intakeId !== undefined)
      student.intake = { id: dto.intakeId } as Intake;

    await this.studentRepo.save(student);
  }

  private async updateInstructorProfile(
    userId: number,
    dto: UpdateInstructorDto,
  ) {
    if (dto.salary === undefined) return;

    const instructor = await this.instructorRepo.findOneBy({
      user: { id: userId },
    });
    if (!instructor) {
      throw new NotFoundException('instructor profile not found');
    }

    instructor.salary = dto.salary;
    await this.instructorRepo.save(instructor);
  }

  private async attachProfile(user: User): Promise<User> {
    switch (user.role) {
      case UserRole.Student: {
        const student = await this.studentRepo.findOne({
          where: { user: { id: user.id } },
          relations: { track: true, branch: true, intake: true },
        });
        user.student = student ?? undefined;
        return user;
      }
      case UserRole.Instructor: {
        const instructor = await this.instructorRepo.findOne({
          where: { user: { id: user.id } },
        });
        user.instructor = instructor ?? undefined;
        return user;
      }
      case UserRole.Manager:
      case UserRole.Admin:
        return user;
    }
  }
}
