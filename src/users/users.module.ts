import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Student } from './entities/students.entity';
import { Instructor } from './entities/instructor.entity';
import { ResolveUpdateUserInterceptor } from './interceptors/resolve-update-user.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Instructor])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, ResolveUpdateUserInterceptor],
})
export class UsersModule {}
