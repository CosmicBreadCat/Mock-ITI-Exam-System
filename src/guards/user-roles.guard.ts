import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/require-role.decorator';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/users.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const userRole = request.user.role;

    if (userRole === UserRole.Admin) return true;
    if (requiredRoles.length === 0) return true;

    if (requiredRoles.includes(userRole)) {
      return true;
    }

    throw new ForbiddenException('No permission to do requested action');
  }
}
