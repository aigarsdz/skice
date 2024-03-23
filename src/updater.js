const fs = require('fs')
const path = require('path')
const ColourfulText = require('./colourful_text')
const ProjectManager = require('./project_manager')
const Select = require('./select')

class Updater {
  #UPGRADE_PATHS = {
    '1.4.1': this.#upgradeFrom141
  }

  versionNumber;
  filePath;
  canvasContext

  upgradeFrom (versionNumber, filePath, canvasContext) {
    this.versionNumber = versionNumber
    this.filePath = filePath
    this.canvasContext = canvasContext

    if (this.#UPGRADE_PATHS[versionNumber]) {
      this.#UPGRADE_PATHS[versionNumber].call(this)
    } else {
      throw new Error('The chosen upgrade path does not exist. Make sure you have specified a correct version number!')
    }
  }

  #upgradeFrom141 () {
    const ct = new ColourfulText()

    if (fs.existsSync(this.filePath)) {
      const projectManager = new ProjectManager()
      const fileInfo = path.parse(this.filePath)
      const projectDirectory = path.join(fileInfo.dir, fileInfo.name)

      projectManager.create(projectDirectory, this.canvasContext)

      try {
        const fileParentDirectoryContent = fs.readdirSync(fileInfo.dir).filter(file => file != fileInfo.base && file != fileInfo.name)
        const select = new Select('Use the space bar to select which files and directories to include in the project!', fileParentDirectoryContent, true)

        fs.copyFileSync(this.filePath, projectManager.sketchFilePath)

        if (fileParentDirectoryContent.length > 0) {
          select.prompt(selected => {
            for (const item of selected) {
              const sourcePath = path.join(fileInfo.dir, item)
              const targetPath = path.join(projectDirectory, item)

              fs.cpSync(sourcePath, targetPath, { recursive: true })
            }
          })
        }
      } catch (error) {
        console.error(ct.red("\nCould not copy files.\n\n").value)
        console.error(error)
      }
    } else {
      console.error(ct.red(`The file path ${this.filePath} does not exist.`))
    }
  }
}

module.exports = Updater
