const path = require('path')
const fs = require('fs')
const ColourfulText = require('./colourful_text')

const PARSE_RESULTS = {
  proceed: 'proceed',
  terminate: 'terminate'
}

class Command {
  #AVAILABLE_COMMANDS = {
    help: this.#parseHelp,
    '-h': this.#parseHelp,
    '--help': this.#parseHelp,
    version: this.#parseVersion,
    '-v': this.#parseVersion,
    '--version': this.#parseVersion,
    'new': this.#parseNewProject,
    'run': this.#parseRun
  }

  #AVAILABLE_OPTIONS = {
    '--context': this.#parseContext,
    '--port': this.#parsePortNumber,
    '--no-browser': this.#disableBrowser
  }

  needsHelp = false
  helpTopic;
  notAvailable = false
  name;
  needsVersionNumber = false
  needsProject = false
  projectDirectoryPath;
  canvasContext = 'webgl'
  needsServer = false
  invokesBrowser = true
  currentDirtectory;
  portNumber = 3000

  constructor (argv) {
    const [nodeExecutable, execulatbleFile, ...callArguments] = argv

    this.#parseArguments(callArguments)
  }

  #parseArguments (callArguments) {
    let argument

    while (callArguments.length > 0) {
      argument = callArguments.shift()

      if (this.#AVAILABLE_COMMANDS[argument]) {
        if (this.#AVAILABLE_COMMANDS[argument].call(this, argument, callArguments) == PARSE_RESULTS.terminate) {
          break
        }
      } else if (argument.startsWith('-')) {
        const [name, value] = argument.split('=')

        if (value) {
          callArguments.unshift(value)
        }

        if (this.#AVAILABLE_OPTIONS[name]) {
          if (this.#AVAILABLE_OPTIONS[name].call(this, name, callArguments) == PARSE_RESULTS.terminate) {
            break
          }
        }
      } else {
        this.needsHelp = true
        this.notAvailable = true
        this.name = argument

        break
      }
    }
  }

  #parseHelp (_, callArguments) {
    const command = callArguments.shift()

    this.needsHelp = true

    if (command) {
      this.helpTopic = command
    }

    return PARSE_RESULTS.terminate
  }

  #parseVersion () {
    this.needsVersionNumber = true

    return PARSE_RESULTS.terminate
  }

  #parseNewProject (_, callArguments) {
    const ct = new ColourfulText()
    const projectDirectoryPath = callArguments.shift()

    if (projectDirectoryPath) {
      this.needsProject = true
      this.projectDirectoryPath = projectDirectoryPath
    } else {
      console.error(ct.red("\nThe project directory path is missing.").value)

      this.needsHelp = true
    }

    return PARSE_RESULTS.proceed
  }

  #parseContext (argument, callArguments) {
    const context = callArguments.shift()

    if (context) {
      this.canvasContext = context
    }
  }

  #parseRun (argument, callArguments) {
    const ct = new ColourfulText()

    this.currentDirtectory = process.cwd()

    const configFilePath = path.join(this.currentDirtectory, 'skice.config.json')

    if (fs.existsSync(configFilePath)) {
      this.needsServer = true
    } else {
      console.error(ct.red("\nThe current directory is not a skice project.\n").value)
    }

    return PARSE_RESULTS.proceed
  }

  #parsePortNumber (argument, callArguments) {
    const portNumber = callArguments.shift()

    if (portNumber) {
      this.portNumber = parseInt(portNumber, 10)
    }

    if (isNaN(this.portNumber)) {
      this.portNumber = 3000
    }
  }

  #disableBrowser () {
    this.invokesBrowser = false

    return PARSE_RESULTS.proceed
  }
}

module.exports = Command
