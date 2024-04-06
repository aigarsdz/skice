const path = require('path')
const fs = require('fs')
const ColourfulText = require('./colourful_text')

function getHelpFilePath(topic) {
  let helpFilePath = path.join(__dirname, 'help_texts', 'help.txt')

  if (topic) {
    const topicHelpFilePath = path.join(__dirname, 'help_texts', `${topic}.txt`)

    if (fs.existsSync(topicHelpFilePath)) {
      helpFilePath = topicHelpFilePath
    }
  }

  return helpFilePath
}

function outputHelp(topic) {
  const helpFilePath = getHelpFilePath(topic)

  try {
    const helpText = fs.readFileSync(helpFilePath).toString()

    console.info(helpText)
  } catch (error) {
    console.error(error)
  }
}

function outputUnavailableCommand(commandName) {
  const ct = new ColourfulText()

  console.warn(
    ct.yellow("\nA command ")
      .red(commandName)
      .yellow(' is not available. Use ')
      .green('help')
      .yellow(' to see the usage information!')
      .value
    )
}

exports.outputHelp = outputHelp
exports.outputUnavailableCommand = outputUnavailableCommand
