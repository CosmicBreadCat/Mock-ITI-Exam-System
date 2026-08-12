import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { UpdateAdminDto } from "../dtos/update/update-admin.dto";
import { UpdateInstructorDto } from "../dtos/update/update-instructor.dto";
import { UpdateManagerDto } from "../dtos/update/update-manager.dto";
import { UpdateStudentDto } from "../dtos/update/update-student.dto";
import { UpdateUserDto } from "../dtos/update/update-user.dto";
import { UserRole, User } from "../entities/users.entity";

const UPDATE_DTO_BY_ROLE: Record<UserRole, ClassConstructor<UpdateUserDto>> = {
  [UserRole.Student]: UpdateStudentDto,
  [UserRole.Instructor]: UpdateInstructorDto,
  [UserRole.Manager]: UpdateManagerDto,
  [UserRole.Admin]: UpdateAdminDto,
};

@Injectable()
export class ResolveUpdateUserInterceptor implements NestInterceptor {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const id = Number(request.params.id);

    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');

    const dtoClass = UPDATE_DTO_BY_ROLE[user.role];
    const dto = plainToInstance(dtoClass, request.body);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length) throw new BadRequestException(errors);

    request.updatePayload = { user, dto };
    return next.handle();
  }
}
