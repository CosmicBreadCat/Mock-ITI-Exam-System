import { config as dotenvConfig } from 'dotenv';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

dotenvConfig({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

const redaction = format((info) => {
  delete info.password;
  return info;
})();

const loggerFormat = format.combine(
  redaction,
  format.timestamp(),
  format.errors({ stack: true }),
);

const dailyRotateOptions = {
  dirname: 'logs',
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '2m',
  maxFiles: '30d',
  zippedArchive: true,
};

export const logger = createLogger({
  level: process.env.LOG_LEVEL,
  format: format.combine(loggerFormat, format.json()),
  transports: [new transports.DailyRotateFile(dailyRotateOptions)],
});

if (process.env.NODE_ENV !== 'prod') {
  logger.add(
    new transports.Console({
      format: format.combine(loggerFormat, format.colorize(), format.simple()),
    }),
  );
}
