import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAdminDto } from '../dtos/create/create-admin.dto';
import { CreateInstructorDto } from '../dtos/create/create-instructor.dto';
import { CreateManagerDto } from '../dtos/create/create-manager.dto';
import { CreateStudentDto } from '../dtos/create/create-student.dto';
import { CreateUserDto } from '../dtos/create/create-user.dto';
import { UserRole } from '../entities/users.entity';

const DTO_BY_ROLE: Record<UserRole, ClassConstructor<CreateUserDto>> = {
  [UserRole.Student]: CreateStudentDto,
  [UserRole.Instructor]: CreateInstructorDto,
  [UserRole.Manager]: CreateManagerDto,
  [UserRole.Admin]: CreateAdminDto,
};

@Injectable()
export class CreateUserPipe implements PipeTransform {
  async transform(value: any) {
    const dtoClass = DTO_BY_ROLE[value?.role as UserRole];
    if (!dtoClass) throw new BadRequestException('Invalid or missing role');

    const instance = plainToInstance(dtoClass, value);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length) throw new BadRequestException(errors);
    return instance;
  }
}
