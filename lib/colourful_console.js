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

class ColourfulConsole {
  #text = ''

  red (text) {
    return this.#colourise(text, RED)
  }

  green (text) {
    return this.#colourise(text, GREEN)
  }

  yellow (text) {
    return this.#colourise(text, YELLOW)
  }

  blue (text) {
    return this.#colourise(text, BLUE)
  }

  cyan (text) {
    return this.#colourise(text, CYAN)
  }

  raw (text) {
    this.#text += text

    return this
  }

  print () {
    console.log(this.#text)

    this.#text = ''
  }

  #colourise (text, colour) {
    this.#text += `${colour}${text}\x1b[0m`

    return this
  }
}

module.exports = ColourfulConsole
