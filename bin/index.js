#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { platform } = require('os')
const { exec } = require('child_process')

const Server = require('../lib/server')
const Command = require('../lib/command')
const Exporter = require('../lib/exporter')

const command = new Command(process.argv)

function openURL (url) {
  if (platform() === 'win32') {
    exec(`cmd /c start ${url}`)
  } else if (platform() === 'darwin') {
    exec(`open ${url}`)
  } else {
    exec(`xdg-open ${url}`)
  }
}

function createOrUpdateImportsFile () {
  const map = {
    noise: {
      key: 'gl-noise',
      value: 'https://unpkg.com/gl-noise@1.6.1/build/glNoise.m.node.js'
    }
  }

  const sketchFileBaseName = path.basename(command.filePath, '.js')
  const importMapFilePath = path.resolve(path.dirname(command.filePath), `${sketchFileBaseName}_packages.json`)

  let imports = {}

  if (fs.existsSync(importMapFilePath)) {
    imports = require(importMapFilePath)
  }

  for (const extra of command.requestedExtras) {
    if (map[extra]) {
      imports[map[extra].key] = map[extra].value
    }
  }

  fs.writeFileSync(importMapFilePath, JSON.stringify(imports, null, 2))
}

if (command.needsVersionNumber) {
  const package = require('../package.json')

  console.log(`skice ${package['version']}`)
}

if (command.isEmpty || command.needsHelp) {
  command.printHelp()
} else if (command.noFile) {
  console.error(`
Specify the sketch file!

To see the usage, execute ${Command.EXECUTABLE_NAME} --help
  `)
} else {
  if (command.needsFile) {
    fs.copyFileSync(path.resolve(__dirname, `../templates/${command.canvasContext}_sketch.js`), command.filePath)
  }

  if (command.needsExtras) {
    createOrUpdateImportsFile()
  }

  if (fs.existsSync(command.filePath)) {
    const server = new Server(command)

    if (command.launchServer) {
      server.start()
    }

    if (command.invokesBrowser) {
      openURL('http://localhost:3000')
    }

    if (command.needsExport) {
      const exporter = new Exporter(command)

      exporter.run()
    }
  } else {
    console.log("\nThe specified sketch file does not exist\n")
  }
}
