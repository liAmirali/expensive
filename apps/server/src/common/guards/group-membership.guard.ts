import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GroupMembershipStatus } from '../../generated/prisma/client.js';
import { Request } from 'express';

@Injectable()
export class GroupMembershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log("GroupMembershipGuard: Checking group membership for request", {
      method: request.method,
      url: request.originalUrl,
      params: request.params,
      user: request.user ? { id: request.user.id } : null,
    });
    const groupId = (request.params?.groupId || request.params?.id) as ID | undefined;
    const userId: ID | undefined = request.user?.id;

    if (!groupId || !userId) {
      throw new ForbiddenException('Missing group context.');
    }

    const membership = await this.prisma.groupMembership.findFirst({
      where: {
        groupId,
        userId,
        status: GroupMembershipStatus.ACTIVE,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a group member.');
    }

    console.log('GroupMembershipGuard: User is an active member of the group', {
      groupId,
      userId,
      membershipId: membership.id,
    });

    request.groupMembership = membership;
    return true;
  }
}
