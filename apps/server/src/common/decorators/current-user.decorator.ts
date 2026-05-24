import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): { id: ID } => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user?.id) throw new UnauthorizedException();
    return user;
  },
);

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ID => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user?.id) throw new UnauthorizedException();
    return user.id;
  },
);
