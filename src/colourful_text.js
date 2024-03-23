const { COLOURS } = require('./constants')

class ColourfulText {
  #value = ''
  #useBold = false

  get value () {
    return this.#value
  }

  default (text) {
    this.#value += text

    return this
  }

  black (text) {
    return this.#colourIn(text, 'black')
  }

  red (text) {
    return this.#colourIn(text, 'red')
  }

  green (text) {
    return this.#colourIn(text, 'green')
  }

  yellow (text) {
    return this.#colourIn(text, 'yellow')
  }

  blue (text) {
    return this.#colourIn(text, 'blue')
  }

  magenta (text) {
    return this.#colourIn(text, 'magenta')
  }

  cyan (text) {
    return this.#colourIn(text, 'cyan')
  }

  white (text) {
    return this.#colourIn(text, 'white')
  }

  gray (text) {
    return this.#colourIn(text, 'gray')
  }

  bold () {
    this.#useBold = true

    return this
  }

  clear () {
    this.#value = ''

    return this
  }

  toString () {
    return this.value
  }

  #colourIn (text, colour) {
    let colourName = colour

    if (this.#useBold) {
      colourName = 'bold' + colourName.charAt(0).toUpperCase() + colourName.slice(1)
      this.#useBold = false
    }

    this.#value += `${COLOURS[colourName]}${text}${COLOURS.reset}`

    return this
  }
}


module.exports = ColourfulText
