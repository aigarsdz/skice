import path from 'node:path'
import fs from 'node:fs'

class Configuration {
  static missing = false
  static skiceVersion;
  static portNumber;
  static watch;

  static async load() {
    const currentDirtectory = process.cwd()
    const configFilePath = path.join(currentDirtectory, 'skice.config.json')

    if (fs.existsSync(configFilePath)) {
      const { default: config } = await import(`file://${configFilePath}`, {
        with: {
          type: 'json'
        }
      })

      this.skiceVersion = config.skiceVersion || config.skice_version
      this.portNumber = config.portNumber || 3000
      this.watch = config.watch || null
    } else {
      this.missing = true
    }
  }
}

export default Configuration
