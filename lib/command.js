const fs = require('fs')
const ColourfulConsole = require('./colourful_console')

const EXECUTABLE_NAME = 'skice'

class Command {
  #arguments = []
  #filePath = null
  #needsHelp = false
  #needsFile = false
  #needsVersionNumber = false
  #invokesBrowser = false
  #needsExtras = false
  #portNumber = 3000
  #launchServer = true
  #requestedExtras = []
  #canvasContext = 'webgl'
  #needsExport = false
  #exportDirectoryPath = null
  #SUPPORTED_OPTIONS = {
    '-h': {
      parserMethod: this.#parseHelp,
      description: 'Outputs help.'
    },
    '--help': {
      parserMethod: this.#parseHelp,
      description: 'Outputs help.'
    },
    '-v': {
      parserMethod: this.#parseVersion,
      description: 'Outputs the version number'
    },
    '--version': {
      parserMethod: this.#parseVersion,
      description: 'Outputs the version number'
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
      description: 'Creates a packages file to add additional packages to the sketch.',
      example: '--extras EXTRA1,EXTRA2...'
    },
    '--context': {
      parserMethod: this.#parseContext,
      description: 'Switches the template used for a new sketch based on the selected canvas context.',
      example: '--context CONTEXT'
    },
    '--port': {
      parserMethod: this.#parsePortNumber,
      description: 'Changes the port number on which the server will be listening.',
      example: '--port PORT_NUMBER'
    },
    '--no-server': {
      parserMethod: this.#parseNoServer,
      description: 'Do not launch the server.'
    },
    '--export': {
      parserMethod: this.#parseExport,
      description: 'Export as a stand-alone project.',
      example: '--export DIRECTORY_PATH'
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
    return this.noFile && !this.needsHelp && !this.#needsVersionNumber
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

  get launchServer () {
    return this.#launchServer
  }

  get needsVersionNumber () {
    return this.#needsVersionNumber
  }

  get needsExport () {
    return this.#needsExport
  }

  get exportDirectoryPath () {
    return this.#exportDirectoryPath
  }

  printHelp () {
    const greatestOptionLength = Object.entries(this.#SUPPORTED_OPTIONS).reduce((result, [option, details]) => {
      let length = result

      if (option.length > length) {
        length = option.length
      }

      if (details.example && details.example.length > length) {
        length = details.example.length
      }

      return length
    }, 1) + 4

    const options = Object.entries(this.#SUPPORTED_OPTIONS).map(([option, details]) => {
      let spacing = ' '.repeat(greatestOptionLength - option.length)
      let optionOutput = option

      if (details.example) {
        spacing = ' '.repeat(greatestOptionLength - details.example.length)
        optionOutput = details.example
      }

      return `  ${optionOutput}${spacing}${details.description}`
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

  #parsePortNumber (argument, callArguments) {
    const portNumber = parseInt(callArguments.shift(), 10)

    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      const cc = new ColourfulConsole()

      cc.red(`\nThe port number must be an integer between 1 and 65535.\nUsing the default port number ${this.#portNumber}.`)
        .print()
    } else {
      this.#portNumber = portNumber
    }
  }

  #parseNoServer () {
    this.#launchServer = false
  }

  #parseVersion () {
    this.#needsVersionNumber = true
  }

  #parseExport (argument, callArguments) {
    const exportDirectoryPath = callArguments.shift()

    if (!exportDirectoryPath) {
      throw new Error('You need to provide the export directory path.')
    }

    if (fs.existsSync(exportDirectoryPath)) {
      throw new Error(`A directory ${exportDirectoryPath} already exists`)
    }

    this.#needsExport = true
    this.#exportDirectoryPath = exportDirectoryPath

    this.#parseNoServer()
  }
}

module.exports = Command
