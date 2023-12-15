const winston = require('winston');

const logger = ((config = {}) => {
    const instance = winston.createLogger({
      level: process.env.LOG_LEVEL,
      format: winston.format.json(),
      defaultMeta: { service: 'content-service' },
      transports: [new winston.transports.Console({ format: winston.format.simple() })],
      ...config,
    });
    return instance;
})();

module.exports = { logger }