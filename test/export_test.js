const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const exportSourceDirectoryPath = path.resolve(__dirname, 'export_source_output')
const exportTargetDirectoryPath = path.resolve(__dirname, 'export_target_output')
const outputSketchPath = path.resolve(exportSourceDirectoryPath, 'sketch.js')

function sleep (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

test('Sketch export', async t => {
  t.beforeEach(() => {
    fs.mkdirSync(exportSourceDirectoryPath)
  })

  t.afterEach(() => {
    fs.rmSync(exportSourceDirectoryPath, { force: true, recursive: true })
    fs.rmSync(exportTargetDirectoryPath, { force: true, recursive: true })
  })

  await t.test('Creates an export directory with all the necessary files', async () => {
    spawn('node', [executablePath, outputSketchPath, '--new', '--no-server'], { encoding : 'utf8' })

    await sleep(2000)

    spawn('node', [executablePath, outputSketchPath, '--export', exportTargetDirectoryPath], { encoding : 'utf8' })

    await sleep(2000)

    assert.ok(fs.existsSync(exportTargetDirectoryPath))
    assert.ok(fs.existsSync(path.join(exportTargetDirectoryPath, 'js', 'sketch.js')))
    assert.ok(fs.existsSync(path.join(exportTargetDirectoryPath, 'index.html')))
  })
})
