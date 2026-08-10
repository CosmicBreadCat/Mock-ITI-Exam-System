import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse();

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `Something went very wrong, ya dun goofed at ${req.method} and ${req.url}`,
        exception instanceof Error
          ? exception.stack
          : 'Exception is not an error, there is no stack',
        `Triggered by user of id ${req.user?.id}`,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ statusCode: 500, message: 'Internal Server Error' });
    }

    return res.status(exception.getStatus()).json(exception.getResponse());
  }
}
