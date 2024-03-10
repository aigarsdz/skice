const RESET = '\x1b[0m'
const BLACK = '\x1b[30m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const MAGENTA = '\x1b[35m'
const CYAN = '\x1b[36m'
const WHITE = '\x1b[37m'
const GRAY = '\x1b[90m'

const BLACK_BACKGROUND = '\x1b[40m'
const RED_BACKGROUND = '\x1b[41m'
const GREEN_BACKGROUND = '\x1b[42m'
const YELLOW_BACKGROUND = '\x1b[43m'
const BLUE_BACKGROUND = '\x1b[44m'
const MAGENTA_BACKGROUND = '\x1b[45m'
const CYAN_BACKGROUND = '\x1b[46m'
const WHITE_BACKGROUND = '\x1b[47m'
const GRAY_BACKGROUND = '\x1b[100m'

class ColourfulText {
  #value = ''

  get value () {
    return this.#value
  }

  black (text) {
    return this.#colourIn(text, BLACK)
  }

  red (text) {
    return this.#colourIn(text, RED)
  }

  green (text) {
    return this.#colourIn(text, GREEN)
  }

  yellow (text) {
    return this.#colourIn(text, YELLOW)
  }

  blue (text) {
    return this.#colourIn(text, BLUE)
  }

  magenta (text) {
    return this.#colourIn(text, MAGENTA)
  }

  cyan (text) {
    return this.#colourIn(text, CYAN)
  }

  white (text) {
    return this.#colourIn(text, WHITE)
  }

  gray (text) {
    return this.#colourIn(text, GRAY)
  }

  #colourIn (text, colour) {
    this.#value += `${colour}${text}${RESET}`

    return this
  }
}


module.exports = ColourfulText
