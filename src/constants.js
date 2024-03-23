const COLOURS = {
  reset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  boldBlack: '\x1b[1;30m',
  boldRed: '\x1b[1;31m',
  boldGreen: '\x1b[1;32m',
  boldYellow: '\x1b[1;33m',
  boldBlue: '\x1b[1;34m',
  boldMagenta: '\x1b[1;35m',
  boldCyan: '\x1b[1;36m',
  boldWhite: '\x1b[1;37m',
  boldGray: '\x1b[1;90m',

  blackBackground: '\x1b[40m',
  redBackground: '\x1b[41m',
  greenBackground: '\x1b[42m',
  yellowBackground: '\x1b[43m',
  blueBackground: '\x1b[44m',
  magentaBackground: '\x1b[45m',
  cyanBackground: '\x1b[46m',
  whiteBackground: '\x1b[47m',
  grayBackground: '\x1b[100m'
}

const ACTIONS = {
  moveUp: '\x1b[1A',
  moveLeft: '\x1b[G',
  eraseLine: '\x1b[2K',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h'
}

exports.COLOURS = COLOURS
exports.ACTIONS = ACTIONS
