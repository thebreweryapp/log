/* eslint-disable no-console */

class LogConsole {
  constructor() {
    this.out = console;
  }

  /**
   * Prints Log to stdout or stderr
   * @param {String} logMessage
   */
  log(logMessage) {
    if (logMessage.level === 'error') {
      this.out.error(logMessage);
    } else {
      this.out.log(logMessage);
    }
  }
}

module.exports = LogConsole;
