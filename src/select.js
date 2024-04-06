const readline = require('readline')
const { ACTIONS } = require('./constants')
const ColourfulText = require('./colourful_text')

class Select {
  label = ''
  options = []
  multiple = false
  callback = () => {}
  selected = []

  #rendered = false
  #selectedOptionIndex = 0

  constructor(label, options, multiple = false) {
    this.label = label
    this.options = options
    this.multiple = multiple
  }

  prompt(callback) {
    this.callback = callback

    process.stdout.write(`${this.label}\n`)
    readline.emitKeypressEvents(process.stdin)
    process.stdin.on('keypress', this.#handleKeyPress.bind(this))
    this.#render()
    process.stdin.setRawMode(true)
    process.stdin.resume()
  }

  #handleKeyPress(_, key) {
    if (key) {
      if (key.name == 'up' && this.#selectedOptionIndex > 0) {
        this.#selectedOptionIndex--
        this.#render()
      } else if (key.name == 'down' && this.#selectedOptionIndex < this.options.length - 1) {
        this.#selectedOptionIndex++
        this.#render()
      } else if (key.name == 'return') {
        this.#finish()
      } else if (key.name == 'escape' || (key.name == 'c' && key.ctrl)) {
        this.#finish(false)
      } else if (key.name == 'space') {
        if (this.multiple) {
          this.selected.push(this.options[this.#selectedOptionIndex])
        } else {
          this.selected = [this.options[this.#selectedOptionIndex]]
        }

        this.#render()
      }
    }
  }

  #finish(saveChanges = true) {
    process.stdin.setRawMode(false)
    process.stdin.pause()

    if (saveChanges) {
      this.callback(this.selected)
    } else {
      this.callback([])
    }

    this.#showCursor()
    process.stdin.removeListener('keypress', this.#handleKeyPress);
  }

  #render() {
    const ct = new ColourfulText()

    if (this.#rendered) {
      this.#eraseLines()
    } else {
      this.#hideCursor()
    }

    for (let i = 0; i < this.options.length; i++) {
      let option = this.options[i]

      if (this.selected.includes(option)) {
        option = `◉ ${option}`
      } else {
        option = `○ ${option}`
      }

      if (i < this.options.length - 1) {
        option += "\n"
      }

      if (i == this.#selectedOptionIndex) {
        process.stdout.write(ct.green(option).value)
      } else {
        process.stdout.write(option)
      }
    }

    this.#rendered = true
  }

  #eraseLines() {
    const optionCount = this.options.length
    let command = ''

    for (let i = 0; i < optionCount; i++) {
      command += ACTIONS.eraseLine

      if (i < optionCount - 1) {
        command += ACTIONS.moveUp
      }
    }

    if (optionCount > 0) {
      command += ACTIONS.moveLeft
    }

    process.stdout.write(command)
  }

  #hideCursor() {
    process.stdout.write(ACTIONS.hideCursor)
  }

  #showCursor() {
    process.stdout.write(ACTIONS.showCursor)
  }
}

module.exports = Select
