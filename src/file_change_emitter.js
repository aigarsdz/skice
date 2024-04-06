const EventEmitter = require('node:events')

class FileChangeEmitter extends EventEmitter {
  changedFiles = []

  #timeoutID;

  addChange(filePath) {
    if (this.#timeoutID) {
      clearTimeout(this.#timeoutID)
    }

    if (!this.changedFiles.includes(filePath)) {
      this.changedFiles.push(filePath)
    }

    this.#timeoutID = setTimeout(() => {
      this.emit('change', this.changedFiles)
      this.changedFiles = []
    }, 400)
  }
}

module.exports = FileChangeEmitter
