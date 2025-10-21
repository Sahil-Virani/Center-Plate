import winston from 'winston';

const logFormat = winston.format.printf(({ level, message, timestamp, stack}) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.errors({stack: true}),
        winston.format.splat(),
        winston.format.colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ],
    exitOnError: false,
});

export default logger;