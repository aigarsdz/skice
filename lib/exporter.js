const path = require('path')
const fs = require('fs')
const Multiselect = require('./Multiselect')

class Exporter {
  #command
  #sketchRoot

  constructor (command) {
    this.#command = command
    this.#sketchRoot = path.dirname(this.#command.filePath)
  }

  run () {
    const sketchFileName = path.basename(this.#command.filePath)
    const sketchDirectoryContent = fs.readdirSync(this.#sketchRoot)
    let template = fs.readFileSync(path.resolve(__dirname + '/../templates/index.html'), 'utf8')

    template = template.replace('//SKETCH_SOURCE_URL', `/js/${sketchFileName}`)

    fs.mkdirSync(this.#command.exportDirectoryPath)
    fs.mkdirSync(path.join(this.#command.exportDirectoryPath, 'js'))
    fs.writeFileSync(path.join(this.#command.exportDirectoryPath, 'index.html'), template, { encoding: 'utf8' })
    fs.copyFileSync(this.#command.filePath, path.join(this.#command.exportDirectoryPath, 'js', sketchFileName))

    if (sketchDirectoryContent.length > 1) {
      const multiselect = new Multiselect('Use the space bar to select which files and directories to include in the exported bundle!', sketchDirectoryContent)

      multiselect.prompt(selected => {
        for (const item of selected) {
          const sourcePath = path.join(this.#sketchRoot, item)
          const targetPath = path.join(this.#command.exportDirectoryPath, item)

          fs.cpSync(sourcePath, targetPath, { recursive: true })
        }
      })
    }
  }
}

module.exports = Exporter
