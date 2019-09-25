/* eslint-disable no-console */
const Logger = require('./Logger');

class AmberLog {
  constructor() {
    this.setDefault();
    this.out = console;
  }

  /**
   * Initialize the Brewery Logger
   * @param {Object} config
   */
  initLogger(config) {
    this.setDefault();
    if (typeof config === 'object') { // check if config is valid JSON object
      if (config.level) {
        this.level = config.level;
        this.setLevel(config.level);
      }
      if (config.transports) { // creates logger instances from transports property on config
        config.transports.forEach((transport) => {
          const instance = {
            level: transport.level ? transport.level : config.level,
            transport: transport.transport,
            filename: transport.filename,
          };
          if (transport.transport === 'Console') { // if Console is configured change our default Console logger
            this.setLevel(transport.level ? transport.level : config.level);
          } else {
            this.add(instance);
          }
        });
      }
    }
    return this;
  }

  /**
   * Sends the log message to all Logger Instances for logging
   * @param {Level} level
   * @param {Object|String} details
   */
  log(level, details) {
    const date = new Date();
    let log = details;
    if (level === 'error' && details instanceof Error) {
      // do not include stackTrace when in process.env.DEBUG is false or in production
      if (process.env.DEBUG === 'false') {
        log = {
          name: details.name,
          message: details.message,
        };
      } else {
        log = {
          name: details.name,
          message: details.message,
          stack: details.stack.split('From previous event:\n'),
        };
      }
    }
    return this.loggers.forEach(async (logger) => {
      try {
        await logger.log(date, level, log);
      } catch (e) {
        logger.log(date, 'error', e.message);
      }
    });
  }

  /**
   * logs a message with error level
   * @param {Object|String} details
   */
  error(details) {
    this.log('error', details);
  }

  /**
   * logs a message with warn level
   * @param {Object|String} details
   */
  warn(details) {
    this.log('warn', details);
  }

  /**
   * logs a message with info level
   * @param {Object|String} details
   */
  info(details) {
    this.log('info', details);
  }

  /**
   * logs a message with verbose level
   * @param {Object|String} details
   */
  verbose(details) {
    this.log('verbose', details);
  }

  /**
   * logs a message with debug level
   * @param {Object|String} details
   */
  debug(details) {
    this.log('debug', details);
  }

  /**
   * Start an execution timer
   * @param {String} label
   */
  time(label) {
    this.out.time(label);
  }

  /**
   * End an execution timer and prints the execution time taken
   * @param {String} label
   */
  timeEnd(label) {
    this.out.timeEnd(label);
  }

  /**
   * Adds a new logger instance to our loggers
   * @param {Object} logger
   */
  add(logger) {
    if (logger.transport === 'File' && logger.filename === undefined) {
      throw Error(`A logger transport instance ${JSON.stringify(logger)} has an invalid configuration. No "filename" property found.`);
    }
    const loggerInstance = new Logger();
    loggerInstance.configure(logger);
    this.loggers.push(loggerInstance);
  }

  /**
   * Set Logging Level for all logger instances
   * @param {String} level
   */
  setLevel(level) {
    this.loggers.forEach((logger) => {
      logger.setLevel(level);
    });
  }

  /**
   * creates a new logger instance with default properties
   */
  setDefault() {
    this.loggers = [];
    const defaultLogger = new Logger();
    this.add(defaultLogger);
  }
}

module.exports = new AmberLog();
