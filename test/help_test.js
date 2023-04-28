const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const { spawnSync } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const expectedOutput = `
Usage:

skice [FILE_PATH] [...OPTIONS]

Options:

  -h           Prints help.
  --help       Prints help.
  --new        Creates the file if it doesn't exist.
  --open       Opens the file in the default browser.
  --extras     Creates a packages file to add additional packages to the sketch.
  --context    Switches the template used for a new sketch based on the selected canvas context.

Available extras:

  noise    gl-noise package (https://github.com/FarazzShaikh/glNoise)

Supported contexts:

  webgl    WebGL context using ThreeJS (default)
  2d       Canvas2D context

`

test('Prints help with a shorthand option', () => {
  const process = spawnSync('node', [executablePath, '-h'], { encoding : 'utf8' })

  if (process.stderr) {
    throw new Error(process.stderr);
  }

  assert.strictEqual(process.stdout, expectedOutput)
})

test('Prints help with a full option', () => {
  const process = spawnSync('node', [executablePath, '--help'], { encoding : 'utf8' })

  if (process.stderr) {
    throw new Error(process.stderr);
  }

  assert.strictEqual(process.stdout, expectedOutput)
})
