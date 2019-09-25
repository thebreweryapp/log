const fs = require('fs');
const path = require('path');

class File {
  constructor(file) {
    this.setLogFile(file);
  }

  /**
   * Sets the File's Timestamp
   */
  setFileTimestamp() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const date = currentDate.getDate().toString().padStart(2, '0');
    const timestamp = `${year}-${month}-${date}`;
    if (this.fileExtension) {
      this.fileName = this.fileName.replace(this.fileExtension, `-${timestamp}${this.fileExtension}`);
    } else {
      this.fileName = `${this.fileName}-${timestamp}`;
    }
  }

  /**
   * Set the Log File Destination
   * @param {String} file
   */
  setLogFile(file) {
    this.file = file;

    // get diretory destination of file
    this.directory = path.dirname(file);

    // create directory if not exists
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory);
    }

    this.fileName = path.basename(file);
    this.fileExtension = path.extname(this.fileName);
  }

  /**
   * Writes the Log to File
   * @param {String} logMessage
   */
  write(logMessage) {
    this.setFileTimestamp();
    const logFile = path.join(this.directory, this.fileName);
    const writableStream = fs.createWriteStream(logFile, { flags: 'a+' });
    writableStream.end(`${JSON.stringify(logMessage)}\n`);
  }
}

module.exports = File;
