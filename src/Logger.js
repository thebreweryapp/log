/* eslint-disable no-console */
const { Level, LEVEL } = require('./Level');
const { Console, File, Transport } = require('./transport');

class Logger {
  constructor() {
    this.levels = LEVEL;
    this.instanceLevel = LEVEL.INFO;
    this.transport = Transport.Console;
  }

  /**
   * Configures the Logger Instance
   * @param {JSON} options
   */
  configure(options) {
    if (options.level) {
      this.instanceLevel = this.getLogEntryLevel(options.level);
    }

    this.transport = options.transport;
    if (this.transport === 'File') {
      this.filename = options.filename;
    }
  }

  /**
   * Set the logger instance level
   * @param {String} level
   */
  setLevel(level) {
    this.instanceLevel = this.getLogEntryLevel(level);
  }

  /**
   * Writes the log message to the specific log transport destination
   * @param {Level} level
   * @param {String|Object} details
   */
  log(datetime, level, details) {
    this.logEntry = { datetime, level, details };
    const logEntryLevel = this.getLogEntryLevel(level);
    if (this.isEntryAllowed(logEntryLevel)) { // if level is valid
      switch (this.transport) {
        case Transport.Console: {
          const console = new Console();
          console.log(this.logEntry);
          break;
        }
        case Transport.File: {
          const file = new File(this.filename);
          file.write(this.logEntry);
          break;
        }
        // case Transport.Http: {
        //   break;
        // }
        default: {
          break;
        }
      }
    }
  }

  /**
   * Converts a logEntry's level string value to the equivalent Level object
   * @param {String} level
   */
  getLogEntryLevel(level) {
    let entryLevel = new Level('invalid', Number.MAX_SAFE_INTEGER);
    if (level === undefined) {
      entryLevel = this.levels.INFO;
    }
    Object.keys(this.levels).forEach((key) => {
      if (this.levels[key].name === level) {
        entryLevel = this.levels[key];
      }
    });
    if (entryLevel.level === Number.MAX_SAFE_INTEGER) {
      // if level is not valid
      throw Error(`A log level specified is invalid on Log ${JSON.stringify(this.logEntry)}`);
    }
    return entryLevel;
  }

  /**
   * Checks if a logEntry should be logged with the logLevel
   * @param {Level} level
   */
  isEntryAllowed(level) {
    if (level.level <= this.instanceLevel.level) {
      return true;
    }
    return false;
  }
}

module.exports = Logger;
