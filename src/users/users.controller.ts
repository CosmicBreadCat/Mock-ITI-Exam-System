import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateUserPipe } from './pipes/create-user.pipe';
import type { CreateUserRequest, UpdateUserRequest } from './users.service';
import { UpdatePayload } from './decorators/update-payload.decorator';
import { User, UserRole } from './entities/users.entity';
import { ResolveUpdateUserInterceptor } from './interceptors/resolve-update-user.interceptor';
import { RequireRole } from '../decorators/require-role.decorator';
import { UpdateUserDto } from './dtos/update/update-user.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { FindUserDto } from './dtos/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequireRole(UserRole.Manager)
  create(
    @Body(CreateUserPipe) dto: CreateUserRequest,
    @CurrentUser() curUser: JwtPayload,
  ) {
    return this.usersService.create(curUser, dto);
  }

  @Patch(':id')
  @RequireRole(UserRole.Admin)
  @UseInterceptors(ResolveUpdateUserInterceptor)
  update(
    @UpdatePayload() { user, dto }: { user: User; dto: UpdateUserRequest },
  ) {
    return this.usersService.update(user, dto);
  }

  @Get()
  @RequireRole(UserRole.Manager)
  findAll(@CurrentUser() curUser: JwtPayload, @Query() search: FindUserDto) {
    return this.usersService.findAll(curUser, search);
  }

  @Get('detailed-view/:id')
  @RequireRole(UserRole.Manager)
  findOne(@Param('id') id: string, @CurrentUser() curUser: JwtPayload) {
    return this.usersService.findOne(Number(id), curUser);
  }

  @Delete(':id')
  @RequireRole(UserRole.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Get('me')
  getProfile(@CurrentUser() curUser: JwtPayload) {
    return this.usersService.findOne(curUser.sub);
  }

  @Patch('me')
  async updateProfile(
    @Body() dto: UpdateUserDto,
    @CurrentUser() curUser: JwtPayload,
  ) {
    const user = await this.usersService.findOne(curUser.sub);
    if (!user)
      throw new NotFoundException(
        'Logged in user not found, something went wrong',
      );
    return this.usersService.update(user, dto);
  }
}
