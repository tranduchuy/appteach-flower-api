// import winston from 'winston';
// import { Logger } from 'winston';
import fs from 'fs';

import * as winston from 'winston';

if (!fs.existsSync('log/')) fs.mkdirSync('log/');

/* const logger = new (Logger)({
  format: (winston.format.combine)(
    (winston.format.colorize)(),
    (winston.format.timestamp)(),
  ),
  transports: [
    new (winston.transports.Console)({level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'}),
    new (winston.transports.File)({filename: 'log/debug.log', level: 'debug'})
  ]
}); */

const todayDir = () => {
  const today = new Date();
  const dd = String(today.getDate());
  const mm = String(today.getMonth() + 1);
  const yyyy = today.getFullYear();

  return dd + '-' + mm + '-' + yyyy + '/';
};

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf((info) => {
          return `${info.timestamp} - [${info.level}]: ${info.message}`;
      })
  ),
  transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: `log/${todayDir()}error.log` }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;

