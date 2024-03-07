const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const { spawnSync } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const expectedOutput = `
Usage:

skice [FILE_PATH] [...OPTIONS]

Options:

  -h                           Outputs help.
  --help                       Outputs help.
  -v                           Outputs the version number
  --version                    Outputs the version number
  --new                        Creates the file if it doesn't exist.
  --open                       Opens the file in the default browser.
  --extras EXTRA1,EXTRA2...    Creates a packages file to add additional packages to the sketch.
  --context CONTEXT            Switches the template used for a new sketch based on the selected canvas context.
  --port PORT_NUMBER           Changes the port number on which the server will be listening.
  --no-server                  Do not launch the server.
  --export DIRECTORY_PATH      Export as a stand-alone project.

Available extras:

  noise    gl-noise package (https://github.com/FarazzShaikh/glNoise)

Supported contexts:

  webgl    WebGL context using ThreeJS (default)
  2d       Canvas2D context

`

test('Outputs help with a shorthand option', () => {
  const process = spawnSync('node', [executablePath, '-h'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout, expectedOutput)
})

test('Outputs help with a full option', () => {
  const process = spawnSync('node', [executablePath, '--help'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout, expectedOutput)
})
