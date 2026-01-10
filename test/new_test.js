import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'
import { spawn } from 'node:child_process'

const executablePath = path.resolve('bin/index.js')
const outputDirectoryPath = path.resolve('test/new_output')
const outputSketchPath = path.resolve(outputDirectoryPath, 'js', 'new_output.js')
const outputConfigPath = path.resolve(outputDirectoryPath, 'skice.config.json')
const outputIndexPath = path.resolve(outputDirectoryPath, 'index.html')
const outputJSPath = path.resolve(outputDirectoryPath, 'js')

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

test('Sketch creation', async t => {
  t.afterEach(() => {
    fs.rmSync(outputDirectoryPath, { force: true, recursive: true })
  })

  await t.test('Creates a new project', async () => {
    spawn('node', [executablePath, 'new', outputDirectoryPath], { encoding : 'utf8' })

    await sleep(6000)
    assert.ok(fs.existsSync(outputSketchPath))
    assert.ok(fs.existsSync(outputSketchPath))
    assert.ok(fs.existsSync(outputConfigPath))
    assert.ok(fs.existsSync(outputIndexPath))
    assert.ok(fs.existsSync(outputJSPath))
  })
})
