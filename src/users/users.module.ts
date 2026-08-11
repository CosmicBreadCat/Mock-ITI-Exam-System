import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Student } from './entities/students.entity';
import { Instructor } from './entities/instructor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Instructor])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
