const fs = require('fs')
const path = require('path')
const ColourfulText = require('./colourful_text')

function getProjectName (directoryPath) {
  return path.basename(directoryPath)
}

function updateTemplateFiles (directoryPath) {
  const projectName = getProjectName(directoryPath)
  const configPath = path.join(directoryPath, 'skice.config.json')
  const configContent = fs.readFileSync(configPath).toString()

  fs.writeFileSync(configPath, configContent.replace('ROOT_FILE_NAME', projectName))
}

function copyTemplateFiles (directoryPath) {
  const templateDirectoryPath = path.join(__dirname, 'templates')

  fs.copyFileSync(path.join(templateDirectoryPath, 'skice.config.json'), path.join(directoryPath, 'skice.config.json'))
  updateTemplateFiles(directoryPath)
}

function createProject (directoryPath) {
  const ct = new ColourfulText()

  try {
    if (fs.existsSync(directoryPath)) {
      const directoryContent = fs.readdirSync(directoryPath)

      if (directoryContent.length > 0) {
        console.error(ct.red("\nThe specified directory is not empty.\n").value)
      } else {
        copyTemplateFiles(directoryPath)
      }
    } else {
      fs.mkdirSync(directoryPath, { recursive: true })
      copyTemplateFiles(directoryPath)
    }

    console.log(ct.green(`\nA new project created in ${directoryPath}`).value)
  } catch (error) {
    console.error(ct.red("\nCould not create a project.\n\n").value)
    console.error(error)
  }
}

exports.createProject = createProject
