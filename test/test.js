const breweryLog = require('../src/brewery-log');

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const test = require('ava');

test('Initialize default logger', (t) => {
  const logger = breweryLog.initLogger();

  t.is(Object.getPrototypeOf(logger), Object.getPrototypeOf(breweryLog));
});

test('Initialize logger with Log Level', (t) => {
  const config = { level: 'info' };
  const logger = breweryLog.initLogger(config);

  t.is(logger.level, config.level);
});

test('Initialize logger with Console Transport', (t) => {
  const config = { transports: [{ transport: 'Console' }] };
  const logger = breweryLog.initLogger(config);

  t.is(logger.loggers[0].transport, 'Console');
});

test('Initialize logger with File Transport', (t) => {
  const config = { transports: [{ transport: 'File', filename: 'test.log' }] };
  const logger = breweryLog.initLogger(config);

  // check index [1] because we have a Console element already by default on index [0]
  t.is(logger.loggers[1].transport, 'File');
});

test('Initialize logger with Multiple File Transport', (t) => {
  const config = {
    transports: [
      { transport: 'File', filename: 'test.log' },
      { transport: 'File', filename: 'another.log' },
    ],
  };

  const logger = breweryLog.initLogger(config);

  let fileLogger = 0;
  logger.loggers.forEach((element) => {
    if (element.transport === 'File') {
      fileLogger += 1;
    }
  });

  t.true(fileLogger > 1);
});

test('Initialize logger with Multiple Transport', (t) => {
  const config = {
    transports: [
      { transport: 'Console' },
      { transport: 'File', filename: 'test.log' },
      { transport: 'File', filename: 'another.log' },
      { transport: 'File', filename: 'error.log', level: 'error' },
    ],
  };

  const logger = breweryLog.initLogger(config);

  t.true(logger.loggers.length > 1);
});

test('Add a logger instance', (t) => {
  const logger = breweryLog.initLogger();

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
  const logger = breweryLog.initLogger();

  const fileLogger = { transport: 'File' };
  const err = t.throws(() => logger.add(fileLogger));

  t.is(err.name, 'Error');
});
