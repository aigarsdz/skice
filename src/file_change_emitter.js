const EventEmitter = require('node:events')

class FileChangeEmitter extends EventEmitter {
  changedFiles = new Set()

  #timeoutID;

  addChange (filePath) {
    if (this.#timeoutID) {
      clearTimeout(this.#timeoutID)
    }

    this.changedFiles.add(filePath)

    this.#timeoutID = setTimeout(() => {
      this.emit('change', Array.from(this.changedFiles))
      this.changedFiles.clear()
    }, 500)
  }
}

module.exports = FileChangeEmitter
