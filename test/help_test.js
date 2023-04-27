const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const { spawnSync } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')

test('Prints help with a shorthand option', () => {
  const expectedOutput = `
Usage:

skice [FILE_PATH] [...OPTIONS]

Options:

  -h          prints help
  --help      prints help
  --new       creates the file if it doesn't exist
  --open      opens the file in the default browser
  --extras    creates a packages file to add additional packages to the sketch

Available extras:

  noise    gl-noise package (https://github.com/FarazzShaikh/glNoise)

`

  const process = spawnSync('node', [executablePath, '-h'], { encoding : 'utf8' })

  if (process.stderr) {
    throw new Error(process.stderr);
  }

  assert.strictEqual(process.stdout, expectedOutput)
})

test('Prints help with a full option', () => {
  const expectedOutput = `
Usage:

skice [FILE_PATH] [...OPTIONS]

Options:

  -h          prints help
  --help      prints help
  --new       creates the file if it doesn't exist
  --open      opens the file in the default browser
  --extras    creates a packages file to add additional packages to the sketch

Available extras:

  noise    gl-noise package (https://github.com/FarazzShaikh/glNoise)

`


  const process = spawnSync('node', [executablePath, '--help'], { encoding : 'utf8' })

  if (process.stderr) {
    throw new Error(process.stderr);
  }

  assert.strictEqual(process.stdout, expectedOutput)
})
