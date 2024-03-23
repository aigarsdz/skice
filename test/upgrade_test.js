const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const outputDirectoryPath = path.resolve(__dirname, 'upgrade_output')
const skice141SketchPath = path.join(outputDirectoryPath, 'sketch.js')

function sleep (time) {
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
    fs.copyFileSync(path.resolve(__dirname, '../src/templates/webgl_sketch.js'), skice141SketchPath)
    spawn('node', [executablePath, 'upgrade', skice141SketchPath, '--from', '1.4.1', '--context', 'webgl'], { encoding : 'utf8' })

    await sleep(2000)
    assert.ok(fs.existsSync(path.join(outputDirectoryPath, 'sketch')))
  })
})
