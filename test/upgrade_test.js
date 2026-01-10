import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'
import { spawn } from 'node:child_process'

const executablePath = path.resolve('bin/index.js')
const outputDirectoryPath = path.resolve('test/upgrade_output')
const skice141SketchPath = path.join(outputDirectoryPath, 'sketch.js')

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

test('Sketch upgrade', async t => {
  t.afterEach(() => {
    fs.rmSync(outputDirectoryPath, { force: true, recursive: true })
  })

  await t.test('Upgrade process from 1.4.1 to 2.0.0', async () => {
    fs.mkdirSync(outputDirectoryPath, { recursive: true })
    fs.copyFileSync(path.resolve('src/templates/webgl_sketch.js'), skice141SketchPath)
    spawn('node', [executablePath, 'upgrade', skice141SketchPath, '--from', '1.4.1', '--context', 'webgl'], { encoding : 'utf8' })

    await sleep(6000)
    assert.ok(fs.existsSync(path.join(outputDirectoryPath, 'sketch')))
  })
})
