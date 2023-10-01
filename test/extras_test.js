const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const outputDirectoryPath = path.resolve(__dirname, 'extras_output')
const outputSketchPath = path.resolve(outputDirectoryPath, 'sketch.js')
const outputPackagesPath = path.resolve(outputDirectoryPath, 'sketch_packages.json')

function sleep (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

test('Extras', async t => {
  t.beforeEach(() => {
    fs.mkdirSync(outputDirectoryPath)
  })

  t.afterEach(() => {
    fs.rmSync(outputDirectoryPath, { force: true, recursive: true })
  })

  await t.test('Creates an imports file if necessary', async () => {
    spawn('node', [executablePath, outputSketchPath, '--new', '--extras=noise', '--no-server'], { encoding : 'utf8' })

    await sleep(2000)
    assert.ok(fs.existsSync(outputPackagesPath))
  })
})
