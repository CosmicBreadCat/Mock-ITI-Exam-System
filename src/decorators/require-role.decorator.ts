import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entities/users.entity';

export const ROLES_KEY = 'requiredRoles';
export const RequireRole = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
