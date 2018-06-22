/* eslint-disable no-console */
const Logger = require('./logger');

class BreweryLog {
  constructor() {
    this.loggers = [];
    this.setDefault();
  }

  /**
   * Initialize the Brewery Logger
   * @param {Object} config
   */
  initLogger(config) {
    this.loggers = [];
    if (typeof config === 'object') { // check if config is valid JSON object
      if (config.transports) { // creates logger instances from transports property on config
        config.transports.forEach((transport) => {
          const instance = {
            level: transport.level ? transport.level : config.level,
            transport: transport.transport,
            filename: transport.filename,
          };
          this.add(instance);
        });
      } else {
        const instance = { level: config.level };
        this.add(instance);
      }
    } else { // set default logger if no config received
      this.setDefault();
    }
    return this;
  }

  /**
   * Sends the log message to all Logger Instances for logging
   * @param {Level} level
   * @param {String} details
   */
  log(level, details) {
    const date = new Date();
    return this.loggers.forEach(async (logger) => {
      await logger.log(date, level, details);
    });
  }

  /**
   * Adds a new logger instance to our loggers
   * @param {Object} logger
   */
  add(logger) {
    if (logger.transport === 'File' && logger.filename === undefined) {
      console.error(new Error(`A logger transport instance ${JSON.stringify(logger)} has an invalid configuration. No "file" property found.`));
      return;
    }
    const loggerInstance = new Logger();
    loggerInstance.configure(logger);
    this.loggers.push(loggerInstance);
  }

  /**
   * creates a new logger instance with default properties
   */
  setDefault() {
    const defaultLogger = new Logger();
    this.add(defaultLogger);
  }
}

module.exports = new BreweryLog();
