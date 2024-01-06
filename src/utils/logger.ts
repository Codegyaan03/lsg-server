import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'scrape-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'scraping.log' }),
  ],
});

export default logger;
