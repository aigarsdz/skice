#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { platform } from 'node:os'
import { exec } from 'node:child_process'

import Configuration from '../src/configuration.js'
import Command from '../src/command.js'
import { outputHelp, outputUnavailableCommand } from '../src/helper.js'
import ProjectManager from '../src/project_manager.js'
import Server from '../src/server.js'
import Updater from '../src/updater.js'
import packageConfiguration from '../package.json' with { type: 'json' }

await Configuration.load()

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

  updater.upgradeFrom(command.upgradePath, command.legacySketchFilePath, command.canvasContext, command.currentDirtectory)
}
