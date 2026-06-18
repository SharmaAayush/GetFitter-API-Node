import env from '@/config/env';
import { createLogger, transport, transports, format } from 'winston';

const loggingTransports: transport[] = [];

if (env.CONSOLE_LOGGING) {
  loggingTransports.push(new transports.Console({
    format: format.cli(),
  }));

}

const logger = createLogger({
  level: env.LOG_LEVEL,
  format: format.json(),
  transports: loggingTransports,
});

export default logger;