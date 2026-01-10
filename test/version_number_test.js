import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import packageConfiguration from '../package.json' with { type: 'json' }

const executablePath = path.resolve('bin/index.js')
const expectedOutput = `${packageConfiguration['name']} ${packageConfiguration['version']}\n`

test('Outputs the version number with a shorthand option', () => {
  const process = spawnSync('node', [executablePath, '-v'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout, expectedOutput)
})

test('Outputs the version number with a full option', () => {
  const process = spawnSync('node', [executablePath, '--version'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout, expectedOutput)
})
