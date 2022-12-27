const winston = require('winston');

const Logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    ]
});

module.exports = {
    Logger
}