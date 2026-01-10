import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const executablePath = path.resolve('bin/index.js')
const expectedOutput = fs.readFileSync(path.resolve('src/help_texts/help.txt')).toString().trim()

test('Outputs help without any commands or options', () => {
  const process = spawnSync('node', [executablePath], { encoding : 'utf8' })

  assert.strictEqual(process.stdout.trim(), expectedOutput)
})

test('Outputs help with a shorthand option', () => {
  const process = spawnSync('node', [executablePath, '-h'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout.trim(), expectedOutput)
})

test('Outputs help with a full option', () => {
  const process = spawnSync('node', [executablePath, '--help'], { encoding : 'utf8' })

  assert.strictEqual(process.stdout.trim(), expectedOutput)
})
