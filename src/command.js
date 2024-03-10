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
    'new': this.#parseNewProject
  }

  needsHelp = false
  helpTopic;
  notAvailable = false
  name;
  needsVersionNumber = false
  needsProject = false
  projectDirectoryPath;

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

    return PARSE_RESULTS.terminate
  }
}

module.exports = Command
