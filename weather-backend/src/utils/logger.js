const winston = require('winston');

const {timestamp, combine, json, simple} = winston.format;
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL|| 'info',
    format: combine(
        timestamp(),
       json()
    ),
    transports:[
        new winston.transports.File({ filename:'logs/error.log', level:'error'}),
        new winston.transports.File({filename: 'logs/combined.log'}),
        new winston.transports.Console({
            format:simple()
        })
    ]
})

module.exports =logger;