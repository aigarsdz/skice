const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const http = require('http')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const outputDirectoryPath = path.resolve(__dirname, 'port_number_output')
const outputSketchPath1 = path.resolve(outputDirectoryPath, 'sketch_1.js')
const outputSketchPath2 = path.resolve(outputDirectoryPath, 'sketch_2.js')

function sleep (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

function getResponseCode (url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => resolve(response.statusCode)).on('error', reject)
  })
}

test('Port number', async t => {
  t.beforeEach(() => {
    fs.mkdirSync(outputDirectoryPath)
  })

  t.afterEach(() => {
    fs.rmSync(outputDirectoryPath, { force: true, recursive: true })
  })

  await t.test('Changes the default port number to a custom one', async () => {
    const process = spawn('node', [executablePath, outputSketchPath1, '--new', '--port', '8000'], { encoding : 'utf8' })

    await sleep(2000)

    const responseCode = await getResponseCode('http://localhost:8000');

    process.kill()
    assert.ok(responseCode, 200)
  })

  await t.test('Reverts to the default port number if an incorrect value is given', async () => {
    const process = spawn('node', [executablePath, outputSketchPath2, '--new', '--port', 'incorrect'], { encoding : 'utf8' })

    await sleep(2000)

    const responseCode = await getResponseCode('http://localhost:3000');

    process.kill()
    assert.ok(responseCode, 200)
  })
})
