const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const http = require('http')

const executablePath = path.resolve(__dirname, '../bin/index.js')
const outputDirectoryPath1 = path.resolve(__dirname, 'port_number_output_1')
const outputDirectoryPath2 = path.resolve(__dirname, 'port_number_output_2')

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

function getResponseCode(url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => resolve(response.statusCode)).on('error', reject)
  })
}

test('Port number', async t => {
  t.afterEach(() => {
    fs.rmSync(outputDirectoryPath1, { force: true, recursive: true })
    fs.rmSync(outputDirectoryPath2, { force: true, recursive: true })
  })

  await t.test('Changes the default port number to a custom one', async () => {
    spawn('node', [executablePath, 'new', outputDirectoryPath1], { encoding : 'utf8' })
    await sleep(6000)

    const process = spawn('node', [executablePath, 'run', '--port', '8000', '--no-browser'], { encoding : 'utf8', cwd: outputDirectoryPath1 })

    await sleep(2000)

    const responseCode = await getResponseCode('http://localhost:8000');

    process.kill()
    await sleep(2000)
    assert.ok(responseCode, 200)
  })

  await t.test('Reverts to the default port number if an incorrect value is given', async () => {
    spawn('node', [executablePath, 'new', outputDirectoryPath2], { encoding : 'utf8' })
    await sleep(6000)

    const process = spawn('node', [executablePath, 'run', '--port', 'error', '--no-browser'], { encoding : 'utf8', cwd: outputDirectoryPath2 })

    await sleep(2000)

    const responseCode = await getResponseCode('http://localhost:3000');

    process.kill()
    await sleep(2000)
    assert.ok(responseCode, 200)
  })
})
