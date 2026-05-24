import { applyDecorators, UseGuards } from '@nestjs/common';
import { GroupMembershipGuard } from '../guards/group-membership.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { Roles } from './roles.decorator.js';
import { GroupRole } from '../../generated/prisma/client.js';

export const GroupRoles = (...roles: GroupRole[]) =>
  applyDecorators(UseGuards(GroupMembershipGuard, RolesGuard), Roles(...roles));
