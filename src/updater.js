import fs from 'node:fs'
import path from 'node:path'
import ColourfulText from './colourful_text.js'
import ProjectManager from './project_manager.js'
import Select from './select.js'

class Updater {
  upgradePath;
  legacySketchFilePath;
  canvasContext;
  currentDirtectory;

  #UPGRADE_PATHS = {
    '1.4.1': this.#upgradeFrom141,
    '2.0.0': this.#upgradeFrom200
  }

  #packageDirectoryPath;

  upgradeFrom(upgradePath, legacySketchFilePath, canvasContext, currentDirtectory, packageDirectoryPath) {
    this.upgradePath = upgradePath
    this.legacySketchFilePath = legacySketchFilePath
    this.canvasContext = canvasContext
    this.currentDirtectory = currentDirtectory
    this.#packageDirectoryPath = packageDirectoryPath

    if (this.#UPGRADE_PATHS[upgradePath]) {
      this.#UPGRADE_PATHS[upgradePath].call(this)
    } else {
      throw new Error('The chosen upgrade path does not exist. Make sure you have specified a correct version number!')
    }
  }

  #upgradeFrom141() {
    const ct = new ColourfulText()

    if (fs.existsSync(this.legacySketchFilePath)) {
      const projectManager = new ProjectManager()
      const fileInfo = path.parse(this.legacySketchFilePath)
      const projectDirectory = path.join(fileInfo.dir, fileInfo.name)

      projectManager.create(projectDirectory, this.canvasContext, this.#packageDirectoryPath)

      try {
        const fileParentDirectoryContent = fs.readdirSync(fileInfo.dir).filter(file => file != fileInfo.base && file != fileInfo.name)
        const select = new Select('Use the space bar to select which files and directories to include in the project!', fileParentDirectoryContent, true)

        fs.copyFileSync(this.legacySketchFilePath, projectManager.sketchFilePath)

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
      console.error(ct.red(`The file path ${this.legacySketchFilePath} does not exist.`).value)
    }
  }

  #upgradeFrom200() {
    const ct = new ColourfulText()
    const sourceCanvasSettingsFilePath = path.resolve(this.#packageDirectoryPath, 'public/canvas_settings.js')
    const sourceCanvasSizeFilePath = path.resolve(this.#packageDirectoryPath, 'public/canvas_size.js')
    const targetCanvasSettingsFilePath = path.join(this.currentDirtectory, 'js/canvas_settings.js')
    const targetCanvasSizeFilePath = path.join(this.currentDirtectory, 'js/canvas_size.js')
    const indexFilePath = path.join(this.currentDirtectory, 'index.html')
    const configFilePath = path.join(this.currentDirtectory, 'skice.config.json')

    try {
      fs.cpSync(sourceCanvasSettingsFilePath, targetCanvasSettingsFilePath)

      console.info(ct.clear().bold().green('update ').default(targetCanvasSettingsFilePath).value)

      fs.cpSync(sourceCanvasSizeFilePath, targetCanvasSizeFilePath)

      console.info(ct.clear().bold().green('update ').default(targetCanvasSizeFilePath).value)

      const content = fs.readFileSync(indexFilePath).toString().replace(
        '"exporter": "/js/exporter.js",',
        `"exporter": "/js/exporter.js",
        "canvas_size": "/js/canvas_size.js",`
      )

      fs.writeFileSync(indexFilePath, content)

      console.info(ct.clear().bold().green('update ').default(indexFilePath).value)

      const skiceConfigContent = fs.readFileSync(configFilePath).toString()
      const config = JSON.parse(skiceConfigContent)

      config.skiceVersion = '2.3.0'

      fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2))

      console.info(ct.clear().bold().green('update ').default(configFilePath).value)
      console.log('\nAdd the following lines to the function that handles window resizing!\n')
      console.log(
        ct.clear()
          .yellow("canvas.style.width = `${canvasSettings.elementWidth}px`\ncanvas.style.height = `${canvasSettings.elementHeight}px`\n")
          .value
      )
    } catch(error) {
      console.error(ct.red('Upgrade failed.').value)
      console.error(error)
    }
  }
}

export default Updater
