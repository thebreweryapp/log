# brewery-log

A Simplified Multi-transport and Structured Logging Library for Brewery Project


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Logging Levels](#logging-levels)
* [Transports](#transports)
* [Contributors](#contributors)
* [License](#license)


## Install

```sh
npm install brewery-log
```


## Usage

**RECOMMENDED:** create your own logger definition

```js
const BreweryLog = require('brewery-log');
const path = require('path');

const logger = BreweryLog.initLogger({
  level: 'info', // Default log level for transports with no specified level
  transports: [
    { transport: 'Console' }, // Prints log to console
    { transport: 'File', filename: 'debug.log', level: 'debug' }, // Writes log with level `debug` and below to `debug.log`
    { transport: 'File', filename: 'error.log', level: 'error' } // Writes error logs to `debug.log`
  ]
});

logger.log('info', { message: 'Welcome to the Brewery' });
```

**DEFAULT:** you may also log it directly using the default `require('brewery-log')`, but this only 
logs to default `stdout` and `stderr` with logging level set to `info`

```js
const logger = require('brewery-log');
logger.log('info', { message: 'Welcome to the Brewery' });
```


## Logging Levels

Logging levels conform to the severity ordering specified by [RFC5424]: _severity of all levels 
is assumed to be numerically **ascending** from most important to least important._

**NOTE:** Usage of unknown log level will not be logged and will log an `Error`

``` js
const levels = { 
  error: 0, 
  warn: 1, 
  info: 2, 
  verbose: 3, 
  debug: 4
};
```


## Transports

The core transports that are currently available to BreweryLog are:
* `Console` - writes the log to the default stdout and stderr

**USAGE**
```js
const logger = BreweryLog.initLogger({
  transports: [{ transport: 'Console', level: 'info' }]
});

logger.log('info', { message: 'Welcome to the Brewery' });
```

**OUTPUT**
```sh
{ datetime: 2018-06-21T08:05:55.266Z,
  level: 'info',
  details: { message: 'Welcome to the Brewery' } }
```

* `File` - writes the log to the specified file with appended datetime(YYYY-MM-DD) on the filename

**USAGE**
```js
const logger = BreweryLog.initLogger({
  transports: [
    transport: 'File', filename: 'debug.log', level: 'debug'
  ],
});

logger.log('info', { message: 'Welcome to the Brewery' });
```

**OUTPUT**
```sh
{"datetime":"2018-06-21T08:05:55.266Z","level":'info',"details":{"message":"Welcome to the Brewery"}}
```


## Contributors

* Ronald dela Cruz
* James Levin Calado

## License

[MIT](LICENSE) © Stratpoint Technologies Inc.