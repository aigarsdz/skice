const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const expectedOutput = fs.readFileSync(path.resolve(__dirname, '../src/help_texts/help.txt'))

test('Outputs help with a shorthand option', () => {
  const process = spawnSync('node', [executablePath, '-h'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout, expectedOutput)
})

test('Outputs help with a full option', () => {
  const process = spawnSync('node', [executablePath, '--help'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout, expectedOutput)
})
