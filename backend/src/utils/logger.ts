import * as winston from 'winston';

const formatconfig = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.simple(),
  winston.format.json(),
  winston.format.prettyPrint(),
  winston.format.errors({ stack: true })
);

const createLog = (filename:string, level:string) =>
  winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: `logs/${filename}.log`,
        level,
        format: formatconfig,
      }),
    ],
  });

const errorLogger = createLog('error', 'error');

const infoLogger = createLog('info', 'info');

const protectLogger = createLog('protect', 'warn');

const logger = {
  info: (log:string) => infoLogger.info(log),
  error: (log:string) => errorLogger.error(log),
  protect: (log:string) => protectLogger.warn(log),
};

export default logger;