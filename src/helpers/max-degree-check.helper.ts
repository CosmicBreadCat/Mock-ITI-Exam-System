import { BadRequestException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export function maxDegreeCheckHandler(error: unknown, className: string) {
  if (
    error instanceof QueryFailedError &&
    (error as QueryFailedError & { code?: string }).code === '23514'
  ) {
    return new BadRequestException(
      `${className} max degree must be greater than min degree, and min degree must be greater than 0`,
    );
  }
  return error;
}
