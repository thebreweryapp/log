class Level {
  constructor(name, level) {
    this.name = name;
    this.level = level;
  }
}

/**
 * Default levels for logs
 */
const LEVEL = {
  ERROR: new Level('error', 0),
  WARN: new Level('warn', 1),
  INFO: new Level('info', 2),
  VERBOSE: new Level('verbose', 3),
  DEBUG: new Level('debug', 4),
};

module.exports = { Level, LEVEL };
