const EXECUTABLE_NAME = 'skice'

class Command {
  #arguments = []
  #filePath = null
  #needsHelp = false
  #needsFile = false
  #invokesBrowser = false
  #needsExtras = false
  #portNumber = 3000
  #requestedExtras = []
  #canvasContext = 'webgl'
  #SUPPORTED_OPTIONS = {
    '-h': {
      parserMethod: this.#parseHelp,
      description: 'Prints help.'
    },
    '--help': {
      parserMethod: this.#parseHelp,
      description: 'Prints help.'
    },
    '--new': {
      parserMethod: this.#parseNew,
      description: "Creates the file if it doesn't exist."
    },
    '--open': {
      parserMethod: this.#parseOpen,
      description: 'Opens the file in the default browser.'
    },
    '--extras': {
      parserMethod: this.#parseExtras,
      description: 'Creates a packages file to add additional packages to the sketch.'
    },
    '--context': {
      parserMethod: this.#parseContext,
      description: 'Switches the template used for a new sketch based on the selected canvas context.'
    }
  }

  constructor (argv) {
    const [nodeExecutable, execulatbleFile, ...callArguments] = argv

    this.#parseOptions(callArguments)
  }

  static get EXECUTABLE_NAME () {
    return EXECUTABLE_NAME
  }

  get filePath () {
    return this.#filePath
  }

  get requestedExtras () {
    return this.#requestedExtras
  }

  get needsHelp () {
    return this.#needsHelp
  }

  get noFile () {
    return this.#filePath === null
  }

  get isEmpty () {
    return this.noFile && !this.needsHelp
  }

  get needsFile () {
    return this.#needsFile
  }

  get invokesBrowser () {
    return this.#invokesBrowser
  }

  get needsExtras () {
    return this.#needsExtras
  }

  get portNumber () {
    return this.#portNumber
  }

  get canvasContext () {
    return this.#canvasContext
  }

  printHelp () {
    const greatestOptionLength = Object.keys(this.#SUPPORTED_OPTIONS).reduce((result, key) => {
      let length = result

      if (key.length > length) {
        length = key.length
      }

      return length
    }, 1) + 4

    const options = Object.entries(this.#SUPPORTED_OPTIONS).map(([option, details]) => {
      const spacing = ' '.repeat(greatestOptionLength - option.length)

      return `  ${option}${spacing}${details.description}`
    }).join('\n')

    console.log(`
Usage:

${this.constructor.EXECUTABLE_NAME} [FILE_PATH] [...OPTIONS]

Options:

${options}

Available extras:

  noise    gl-noise package (https://github.com/FarazzShaikh/glNoise)

Supported contexts:

  webgl    WebGL context using ThreeJS (default)
  2d       Canvas2D context
`)
  }

  #parseOptions (callArguments) {
    while (callArguments.length > 0) {
      let argument = callArguments.shift()

      if (argument.startsWith('-')) {
        if (argument.includes('=')) {
          const [argumentName, argumentValue] = argument.split('=')

          argument = argumentName

          callArguments.unshift(argumentValue)
        }

        if (this.#SUPPORTED_OPTIONS.hasOwnProperty(argument)) {
          this.#SUPPORTED_OPTIONS[argument].parserMethod.call(this, argument, callArguments)
        }
      } else if (!this.filePath && argument.endsWith('.js')) {
        this.#filePath = argument
      }
    }
  }

  #parseHelp () {
    this.#needsHelp = true
  }

  #parseNew () {
    this.#needsFile = true
  }

  #parseOpen () {
    this.#invokesBrowser = true
  }

  #parseExtras (argument, callArguments) {
    const availableExtras = ['noise']

    let requestedExtras = callArguments.shift()

    if (requestedExtras.startsWith('-')) {
      callArguments.unshift(requestedExtras)
    } else {
      for (const extra of requestedExtras.split(',')) {
        if (availableExtras.includes(extra)) {
          this.#needsExtras = true
          this.#requestedExtras.push(extra)
        }
      }
    }
  }

  #parseContext (argument, callArguments) {
    const availableContexts = ['webgl', '2d']

    let canvasContext = callArguments.shift()

    if (canvasContext.startsWith('-')) {
      callArguments.unshift(canvasContext)
    } else {
      if (availableContexts.includes(canvasContext)) {
        this.#canvasContext = canvasContext
      }
    }
  }
}

module.exports = Command
