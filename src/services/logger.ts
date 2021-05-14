import winston = require('winston');
const { combine, timestamp, label, prettyPrint, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}]: ${message}`;
});

export const logger = winston.createLogger({
    format: myFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: `${__dirname}/../../logs/logs.log`,
            maxsize: 104857600, // 100 MB
            maxFiles: 5
        })/*,
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })*/
    ]
});

export const logInfo = (message: string) => {
    logger.log({ timestamp: new Date(), level: 'info', message: message });
}

export const logError = (message: string) => {
    logger.log({ timestamp: new Date(), level: 'error', message: message });
}