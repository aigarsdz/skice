const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const outputDirectoryPath = path.resolve(__dirname, 'context_output')
const outputSketchPath = path.resolve(outputDirectoryPath, 'sketch.js')
const webGLTemplatePath = path.resolve(__dirname, '../templates/webgl_sketch.js')
const canvas2dTemplatePath = path.resolve(__dirname, '../templates/2d_sketch.js')

function sleep (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

test('Sketch creation with an explicit context', async t => {
  t.beforeEach(() => {
    fs.mkdirSync(outputDirectoryPath)
  })

  t.afterEach(() => {
    fs.rmSync(outputDirectoryPath, { force: true, recursive: true })
  })

  await t.test('Creates a new WebGL file', async () => {
    const process = spawn('node', [executablePath, outputSketchPath, '--new', '--context=webgl'], { encoding : 'utf8' })

    await sleep(2000)
    process.kill()
    assert.ok(fs.existsSync(outputSketchPath))

    const newFileContent = fs.readFileSync(outputSketchPath, 'utf8')
    const templateContent = fs.readFileSync(webGLTemplatePath, 'utf8')

    assert.strictEqual(newFileContent, templateContent)
  })

  await t.test('Creates a new Canvas2D file', async () => {
    const process = spawn('node', [executablePath, outputSketchPath, '--new', '--context=2d'], { encoding : 'utf8' })

    await sleep(2000)
    process.kill()
    assert.ok(fs.existsSync(outputSketchPath))

    const newFileContent = fs.readFileSync(outputSketchPath, 'utf8')
    const templateContent = fs.readFileSync(canvas2dTemplatePath, 'utf8')

    assert.strictEqual(newFileContent, templateContent)
  })
})
