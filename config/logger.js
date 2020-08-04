const winston = require('winston');
 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ 
    filename: 'error.log',
     level: 'info' ,
    format: winston.format.combine(winston.format.timestamp()
    ,
    winston.format.json()
    )}),
    // new winston.transports.Console()

  ],
});

module.exports = logger;
 