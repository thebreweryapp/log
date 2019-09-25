const Console = require('./transports/LogConsole');
const File = require('./transports/File');

const Transport = {
  Console: 'Console',
  File: 'File',
  Http: 'Http',
};

module.exports = { Console, File, Transport };
