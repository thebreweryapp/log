const amberLog = require('./src/AmberLog');
const path = require('path');

const errorLog = path.join(__dirname, './logs/error.log');
const warnLog = path.join(__dirname, './logs/warn.log');
const infoLog = path.join(__dirname, './logs/info.log');
const verbLog = path.join(__dirname, './logs/verbose.log');
const debugLog = path.join(__dirname, './logs/debug.log');

const logger = amberLog.initLogger({
  level: 'info',
  transports: [
    { transport: 'Console' },
    { transport: 'File', filename: errorLog, level: 'info' },
    { transport: 'File', filename: warnLog, level: 'warn' },
    { transport: 'File', filename: infoLog, level: 'info' },
    { transport: 'File', filename: verbLog, level: 'verbose' },
    { transport: 'File', filename: debugLog, level: 'debug' },
  ],
});

logger.log('info', { message: 'Welcome to the Brewery' });
logger.log('error', { message: 'test log error' });
logger.log('warn', { message: 'test log warn' });
logger.log('verbose', { message: 'test log verbose' });
logger.log('error', { message: 'test log error' });
logger.log('debug', { message: 'test log debug' });
logger.log('invalid', { message: 'test log invalid' });
logger.time('test execution timer');
logger.timeEnd('test execution timer');
