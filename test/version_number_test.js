const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const { spawnSync } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const package = require('../package.json')
const expectedOutput = `skice ${package['version']}\n`

test('Outputs the version number with a shorthand option', () => {
  const process = spawnSync('node', [executablePath, '-v'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout, expectedOutput)
})

test('Outputs the version number with a full option', () => {
  const process = spawnSync('node', [executablePath, '--version'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout, expectedOutput)
})
