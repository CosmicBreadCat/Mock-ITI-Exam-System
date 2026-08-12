import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UpdatePayload = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().updatePayload,
);
