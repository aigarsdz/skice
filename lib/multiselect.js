const readline = require('readline')

class Multiselect {
  #label = ''
  #options = []
  #selected = []
  #cursorPosition = { x: 0, y: 0 }
  #input
  #rendered = false
  #selectedOptionIndex = 0
  #callback = () => {}

  constructor (label, options) {
    this.#label = label
    this.#options = options
    this.#input = options.length - 1
  }

  prompt (callback) {
    this.#callback = callback

    process.stdout.write(`${this.#label}\n`)
    readline.emitKeypressEvents(process.stdin)
    process.stdin.on('keypress', this.handleKeyPress.bind(this))
    this.render()
    process.stdin.setRawMode(true)
    process.stdin.resume()
  }

  eraseLines () {
    const optionCount = this.#options.length
    let command = ''

    for (let i = 0; i < optionCount; i++) {
      command += "\u001B[2K"

      if (i < optionCount - 1) {
        command += "\u001B[1A"
      }
    }

    if (optionCount > 0) {
      command += "\u001B[G"
    }

    process.stdout.write(command)
  }

  render () {
    if (this.#rendered) {
      this.eraseLines()
    } else {
      this.hideCursor()
    }

    for (let i = 0; i < this.#options.length; i++) {
      let option = this.#options[i]

      if (this.#selected.includes(option)) {
        option = `◉ ${option}`
      } else {
        option = `○ ${option}`
      }

      if (i < this.#options.length - 1) {
        option += "\n"
      }

      if (i == this.#selectedOptionIndex) {
        process.stdout.write(this.colour(option))
      } else {
        process.stdout.write(option)
      }
    }

    this.#rendered = true
  }

  handleKeyPress (_, key) {
    if (key) {
      if (key.name == 'up' && this.#selectedOptionIndex > 0) {
        this.#selectedOptionIndex--
        this.render()
      } else if (key.name == 'down' && this.#selectedOptionIndex < this.#options.length - 1) {
        this.#selectedOptionIndex++
        this.render()
      } else if (key.name == 'return') {
        this.finish()
      } else if (key.name == 'escape' || (key.name == 'c' && key.ctrl)) {
        this.finish(false)
      } else if (key.name == 'space') {
        this.#selected.push(this.#options[this.#selectedOptionIndex])
        this.render()
      }
    }
  }

  finish (saveChanges = true) {
    process.stdin.setRawMode(false)
    process.stdin.pause()

    if (saveChanges) {
      this.#callback(this.#selected)
    } else {
      this.#callback([])
    }

    this.showCursor()
    process.stdin.removeListener('keypress', this.handleKeyPress);
  }

  hideCursor() {
    process.stdout.write("\u001B[?25l")
  }

  showCursor() {
    process.stdout.write("\u001B[?25h")
  }

  colour (text, colourName = "green") {
    const colours = {
      yellow: [33, 89],
      blue: [34, 89],
      green: [32, 89],
      cyan: [35, 89],
      red: [31, 89],
      magenta: [36, 89]
    }

    const colour = colours[colourName]
    const start = "\x1b[" + colour[0] + "m"
    const stop = "\x1b[" + colour[1] + "m\x1b[0m"
    return start + text + stop
  }
}

module.exports = Multiselect
