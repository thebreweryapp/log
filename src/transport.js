const Console = require('./transports/console');
const File = require('./transports/file');

const Transport = {
  Console: 'Console',
  File: 'File',
  Http: 'Http',
};

module.exports = { Console, File, Transport };
