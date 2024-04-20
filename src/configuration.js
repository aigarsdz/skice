const path = require('path')
const fs = require('fs')

class Configuration {
  static missing = false
  static skiceVersion;
  static portNumber;
  static watch;

  static load() {
    const currentDirtectory = process.cwd()
    const configFilePath = path.join(currentDirtectory, 'skice.config.json')

    if (fs.existsSync(configFilePath)) {
      const config = require(configFilePath)

      this.skiceVersion = config.skiceVersion || config.skice_version
      this.portNumber = config.portNumber || 3000
      this.watch = config.watch || null
    } else {
      this.missing = true
    }
  }
}

module.exports = Configuration
