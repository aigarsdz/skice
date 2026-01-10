import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'
import { spawn } from 'node:child_process'

const executablePath = path.resolve('bin/index.js')
const webglOutputDirectoryPath = path.resolve('test/context_output_1')
const canvas2dOutputDirectoryPath = path.resolve('test/context_output_2')
const webGLTemplatePath = path.resolve('src/templates/webgl_sketch.js')
const canvas2dTemplatePath = path.resolve('src/templates/2d_sketch.js')

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

test('Sketch creation with an explicit context', async t => {
  t.afterEach(() => {
    fs.rmSync(webglOutputDirectoryPath, { force: true, recursive: true })
    fs.rmSync(canvas2dOutputDirectoryPath, { force: true, recursive: true })
  })

  await t.test('Creates a new WebGL file', async () => {
    spawn('node', [executablePath, 'new', webglOutputDirectoryPath, '--context=webgl'], { encoding : 'utf8' })

    await sleep(6000)
    assert.ok(fs.existsSync(webglOutputDirectoryPath))

    const newFileContent = fs.readFileSync(path.join(webglOutputDirectoryPath, 'js', 'context_output_1.js'), 'utf8').toString()
    const templateContent = fs.readFileSync(webGLTemplatePath, 'utf8').toString()

    assert.strictEqual(newFileContent, templateContent)
  })

  await t.test('Creates a new Canvas2D file', async () => {
    spawn('node', [executablePath, 'new', canvas2dOutputDirectoryPath, '--context=2d'], { encoding : 'utf8' })

    await sleep(6000)
    assert.ok(fs.existsSync(canvas2dOutputDirectoryPath))

    const newFileContent = fs.readFileSync(path.join(canvas2dOutputDirectoryPath, 'js', 'context_output_2.js'), 'utf8').toString()
    const templateContent = fs.readFileSync(canvas2dTemplatePath, 'utf8').toString()

    assert.strictEqual(newFileContent, templateContent)
  })
})
