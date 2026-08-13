import { BadRequestException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export function examCheckHandler(error: unknown, className: string) {
  if (
    error instanceof QueryFailedError &&
    (error as QueryFailedError & { code?: string }).code === '23514'
  ) {
    return new BadRequestException(
      `${className} end time must be after start time, min degree must be greater than 0, max degree must be greater than min degree, and pass degree must be between min and max degree`,
    );
  }
  return error;
}
