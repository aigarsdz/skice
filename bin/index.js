#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { platform } = require('os')
const { exec } = require('child_process')

const Configuration = require('../src/configuration')
const Command = require('../src/command')
const { outputHelp, outputUnavailableCommand } = require('../src/helper')
const ProjectManager = require('../src/project_manager')
const Server = require('../src/server')
const Updater = require('../src/updater')

Configuration.load()

const command = new Command(process.argv)

function openURL(url) {
  if (platform() === 'win32') {
    exec(`cmd /c start ${url}`)
  } else if (platform() === 'darwin') {
    exec(`open ${url}`)
  } else {
    exec(`xdg-open ${url}`)
  }
}

if (command.notAvailable) {
  outputUnavailableCommand(command.name)
}

if (command.needsHelp) {
  outputHelp(command.helpTopic)
}

if (command.needsVersionNumber) {
  const packageConfiguration = require('../package.json')

  console.log(`${packageConfiguration['name']} ${packageConfiguration['version']}`)
}

if (command.needsProject) {
  const projectManager = new ProjectManager()

  projectManager.create(command.projectDirectoryPath, command.canvasContext)
}

if (command.needsServer) {
  const server = new Server(command)

  server.start()

  if (command.invokesBrowser) {
    openURL(`http://localhost:${command.portNumber}`)
  }
}

if (command.needsUpgrade) {
  const updater = new Updater()

  updater.upgradeFrom(command.upgradePathOrigin, command.upgradePath, command.canvasContext)
}
