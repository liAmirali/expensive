import { SetMetadata } from '@nestjs/common';
import { GroupRole } from '../../generated/prisma/client.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: GroupRole[]) => SetMetadata(ROLES_KEY, roles);
