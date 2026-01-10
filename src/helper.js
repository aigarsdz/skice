import path from 'node:path'
import fs from 'node:fs'
import ColourfulText from './colourful_text.js'

function getHelpFilePath(topic) {
  let helpFilePath = path.join('src', 'help_texts', 'help.txt')

  if (topic) {
    const topicHelpFilePath = path.join('src', 'help_texts', `${topic}.txt`)

    if (fs.existsSync(topicHelpFilePath)) {
      helpFilePath = topicHelpFilePath
    }
  }

  return helpFilePath
}

export function outputHelp(topic) {
  const helpFilePath = getHelpFilePath(topic)

  try {
    const helpText = fs.readFileSync(helpFilePath).toString()

    console.info(helpText)
  } catch (error) {
    console.error(error)
  }
}

export function outputUnavailableCommand(commandName) {
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
