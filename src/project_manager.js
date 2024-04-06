const fs = require('fs')
const path = require('path')
const ColourfulText = require('./colourful_text')

const DIRECTORY_STATUS = {
  missing: 'missing',
  notEmpty: 'notEmpty',
  error: 'error',
  valid: 'valid'
}

class ProjectManager {
  directoryPath;
  projectName;
  canvasContext;
  sketchFilePath;

  #errors = []

  create(directoryPath, canvasContext) {
    this.directoryPath = directoryPath
    this.projectName = path.basename(directoryPath)
    this.canvasContext = canvasContext

    const ct = new ColourfulText()

    switch (this.#getDirectoryStatus()) {
      case DIRECTORY_STATUS.notEmpty:
        console.error(ct.red("\nThe specified directory is not empty.\n").value)

        break
      case DIRECTORY_STATUS.error: {
        const error = this.#errors.pop()

        console.error(ct.red("\nCould not create a project.\n\n").value)
        console.error(error)

        break
      }
      case DIRECTORY_STATUS.missing:
        fs.mkdirSync(this.directoryPath, { recursive: true })

        console.info(ct.bold().green("create ").default(this.directoryPath).value)
      default:{
        const jsDirectoryPath = path.join(this.directoryPath, 'js')

        fs.mkdirSync(jsDirectoryPath)

        console.info(ct.clear().bold().green("create ").default(jsDirectoryPath).value)

        this.#copyTemplateFiles()
        this.#updateTemplateFiles()
        this.#copyPublicFiles()
      }
    }
  }

  #getDirectoryStatus() {
    try {
      if (fs.existsSync(this.directoryPath)) {
        const directoryContent = fs.readdirSync(this.directoryPath)

        if (directoryContent.length > 0) {
          return DIRECTORY_STATUS.notEmpty
        }

        return DIRECTORY_STATUS.valid
      } else {
        return DIRECTORY_STATUS.missing
      }
    } catch (error) {
      this.#errors.push(error)

      return DIRECTORY_STATUS.error
    }
  }

  #copyTemplateFiles() {
    this.#copyConfigFile()
    this.#copyIndexFile()
    this.#copySketchFile()
  }

  #copyConfigFile() {
    const templateDirectoryPath = path.join(__dirname, 'templates')

    this.#copyFile(path.join(templateDirectoryPath, 'skice.config.json'), path.join(this.directoryPath, 'skice.config.json'))
  }

  #copyIndexFile() {
    const templateDirectoryPath = path.join(__dirname, 'templates')

    this.#copyContextSpecificFile(
      path.join(templateDirectoryPath, 'webgl_index.html'),
      path.join(templateDirectoryPath, '2d_index.html'),
      path.join(this.directoryPath, 'index.html')
    )
  }

  #copySketchFile() {
    const templateDirectoryPath = path.join(__dirname, 'templates')

    this.sketchFilePath = path.join(this.directoryPath, 'js', `${this.projectName}.js`)

    this.#copyContextSpecificFile(
      path.join(templateDirectoryPath, 'webgl_sketch.js'),
      path.join(templateDirectoryPath, '2d_sketch.js'),
      this.sketchFilePath
    )
  }

  #copyFile(sourcePath, targetPath) {
    const ct = new ColourfulText()

    try {
      fs.copyFileSync(sourcePath, targetPath)

      console.info(ct.bold().green("create ").default(targetPath).value)
    } catch (error) {
      console.error(error)
    }
  }

  #copyContextSpecificFile(webGLSourcePath, canvas2DSourcePath, targetPath) {
    const ct = new ColourfulText()

    try {
      if (this.canvasContext == 'webgl') {
        fs.copyFileSync(webGLSourcePath, targetPath)
      } else {
        fs.copyFileSync(canvas2DSourcePath, targetPath)
      }

      console.info(ct.bold().green("create ").default(targetPath).value)
    } catch (error) {
      console.error(error)
    }
  }

  #updateTemplateFiles() {
    const packageConfiguration = require('../package.json')

    const ct = new ColourfulText()
    const configPath = path.join(this.directoryPath, 'skice.config.json')
    const htmlPath = path.join(this.directoryPath, 'index.html')
    const configContent = fs.readFileSync(configPath).toString()
    const htmlContent = fs.readFileSync(htmlPath).toString()

    try {
      fs.writeFileSync(
        configPath,
        configContent.replace('VERSION_NUMBER', packageConfiguration['version'])
      )

      fs.writeFileSync(
        htmlPath,
        htmlContent.replace('//SKETCH_SOURCE_URL', `/js/${this.projectName}.js`)
      )
    } catch (error) {
      console.error(ct.red("\nCould not update the template files.\n\n").value)
      console.error(error)
    }
  }

  #copyPublicFiles() {
    const ct = new ColourfulText()
    const publicDirectoryPath = path.resolve(__dirname, '..', 'public')

    try {
      const publicDirectoryContent = fs.readdirSync(publicDirectoryPath)

      for (const fileName of publicDirectoryContent) {
        if (fileName.endsWith('.js')) {
          const targetPath = path.join(this.directoryPath, 'js', fileName)

          fs.copyFileSync(path.join(publicDirectoryPath, fileName), targetPath)

          console.info(ct.clear().bold().green("create ").default(targetPath).value)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = ProjectManager
