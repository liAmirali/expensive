import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GroupMembershipStatus } from '../../generated/prisma/client.js';

@Injectable()
export class GroupMembershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const groupId: ID | undefined = request.params?.groupId || request.params?.id;
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

    request.groupMembership = membership;
    return true;
  }
}
