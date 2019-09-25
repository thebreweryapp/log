/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const amberLog = require('../src/AmberLog');

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const test = require('ava');
const sinon = require('sinon');
const fs = require('fs');

const getTimestamp = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const date = currentDate.getDate().toString().padStart(2, '0');
  const timestamp = `${year}-${month}-${date}`;
  return timestamp;
};

const removeDirectory = (dir) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = `${dir}/${file}`;
      fs.unlinkSync(curPath);
    });
    fs.rmdirSync(dir);
  }
};

test.before((t) => {
  removeDirectory('./logs');

  t.true(!fs.existsSync('./logs'));
});

test.beforeEach((t) => {
  t.context.console = console;
  console.log = sinon.spy();
  console.error = sinon.spy();
  console.time = sinon.spy();
  console.timeEnd = sinon.spy();
});

test.afterEach((t) => {
  console.log = t.context.console.log;
  console.error = t.context.console.error;
  console.time = t.context.console.time;
  console.timeEnd = t.context.console.timeEnd;
});

test('Initialize logger - Default', (t) => {
  const logger = amberLog.initLogger();

  t.is(Object.getPrototypeOf(logger), Object.getPrototypeOf(amberLog));
});

test('Initialize logger - Log Level', (t) => {
  const config = { level: 'info' };
  const logger = amberLog.initLogger(config);

  t.is(logger.level, config.level);
});

test('Initialize logger - Console Transport', (t) => {
  const config = { transports: [{ transport: 'Console' }] };
  const logger = amberLog.initLogger(config);

  t.is(logger.loggers[0].transport, 'Console');
});

test('Initialize logger with File Transport', (t) => {
  const config = { transports: [{ transport: 'File', filename: 'test.log' }] };
  const logger = amberLog.initLogger(config);

  // check index [1] because we have a Console element already by default on index [0]
  t.is(logger.loggers[1].transport, 'File');
});

test('Initialize logger - HTTP Transport', (t) => {
  const config = { transports: [{ transport: 'Http' }] };
  const logger = amberLog.initLogger(config);

  t.is(logger.loggers[1].transport, 'Http');
});

test('Initialize logger - Multiple File Transport', (t) => {
  const config = {
    transports: [
      { transport: 'File', filename: 'test.log' },
      { transport: 'File', filename: 'another.log' },
    ],
  };

  const logger = amberLog.initLogger(config);

  let fileLogger = 0;
  logger.loggers.forEach((element) => {
    if (element.transport === 'File') {
      fileLogger += 1;
    }
  });

  t.true(fileLogger > 1);
});

test('Initialize logger - Multiple Transport', (t) => {
  const config = {
    transports: [
      { transport: 'Console', level: 'info' },
      { transport: 'File', filename: 'test.log' },
      { transport: 'File', filename: 'another.log' },
      { transport: 'File', filename: 'error.log', level: 'error' },
    ],
  };

  const logger = amberLog.initLogger(config);

  t.true(logger.loggers.length > 1);
});

test('Logging - Unknown Transport Type', (t) => {
  const config = { transports: [{ transport: 'Unknown' }] };
  const logger = amberLog.initLogger(config);

  logger.log('level', 'test');
  t.true(true);
});

test('Add a logger instance', (t) => {
  const logger = amberLog.initLogger();

  const fileLogger = { transport: 'File', filename: 'test.log' };
  logger.add(fileLogger);

  const exists = logger.loggers.find((element) => {
    if (element.transport === fileLogger.transport &&
          element.filename === fileLogger.filename) { return true; }
    return false;
  });

  t.truthy(exists);
});

test('Invalid - File Transport no filename', (t) => {
  const logger = amberLog.initLogger();

  const fileLogger = { transport: 'File' };
  const err = t.throws(() => logger.add(fileLogger));

  t.is(err.name, 'Error');
});

test('Console Log', (t) => {
  const logger = amberLog.initLogger();

  logger.log('info', 'Test log on Console');

  t.true(console.log.calledOnce);
});

test('Console Error', (t) => {
  const logger = amberLog.initLogger();

  logger.log('error', 'Test log on Console');

  t.true(console.error.calledOnce);
});

test('Log Entry - unknown log level', (t) => {
  const logger = amberLog.initLogger();

  logger.log('invalid', 'Test log with invalid level');
  t.true(console.error.calledOnce);
});

test('Log Entry - greater that log level config', (t) => {
  const logger = amberLog.initLogger();

  logger.debug('Test log with level greater than log level config');
  t.falsy(console.log.calledOnce);
});

test('Log to File - with file extension', (t) => {
  const logger = amberLog.initLogger();
  const fileLogger = { transport: 'File', filename: './logs/test.log' };
  logger.add(fileLogger);

  logger.log('info', 'Test write to file');

  t.true(fs.existsSync(`./logs/test-${getTimestamp()}.log`));
});

test('Log to File - without file extension', (t) => {
  const logger = amberLog.initLogger();
  const fileLogger = { transport: 'File', filename: './logs/test' };
  logger.add(fileLogger);

  logger.log('info', 'Test write to file');

  t.true(fs.existsSync(`./logs/test-${getTimestamp()}.log`));
});

test('Log to Http', (t) => {
  const config = { transports: [{ transport: 'Http' }] };
  const logger = amberLog.initLogger(config);

  logger.log('info', 'Test log via Http');

  t.true(true);
});

test('Log to Unknown', (t) => {
  const config = { transports: [{ transport: 'Unknown' }] };
  const logger = amberLog.initLogger(config);

  logger.log('info', 'Test log with unknown transport type config');

  t.true(true);
});

test('Log level function - ERROR', (t) => {
  const logger = amberLog.initLogger();

  logger.error(new Error('Test log.error function'));
  t.true(console.error.calledOnce);
});

test('Log level function - WARN', (t) => {
  const logger = amberLog.initLogger();

  logger.warn('Test log.warn function');
  t.true(console.log.calledOnce);
});

test('Log level function - INFO', (t) => {
  const logger = amberLog.initLogger();

  logger.info('Test log.info function');
  t.true(console.log.calledOnce);
});

test('Log level function - VERBOSE', (t) => {
  const logger = amberLog.initLogger({ level: 'verbose' });

  logger.verbose('Test log.verbose function');
  t.true(console.log.calledOnce);
});

test('Log level function - DEBUG', (t) => {
  const logger = amberLog.initLogger({ level: 'debug' });

  logger.debug('Test log.debug function');
  t.true(console.log.calledOnce);
});

test('Error Trace - Production', (t) => {
  process.env.DEBUG = false;
  const logger = amberLog.initLogger();

  logger.error(new Error('Test log.error function on production'));
  t.true(console.error.calledOnce);
});

test('Log Execution Time', (t) => {
  const logger = amberLog;

  logger.time('test execution timer');
  logger.timeEnd('test execution timer');

  t.true(console.time.calledOnce && console.timeEnd.calledOnce);
});

test.after('Cleanup', (t) => {
  removeDirectory('./logs');

  t.true(!fs.existsSync('./logs'));
});
