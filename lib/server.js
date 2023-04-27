const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ColourfulConsole = require('./colourful_console')
const FileServer = require('./file_server')
const RequestHandler = require('./request_handler')

class Server {
  #command
  #sketchRoot
  #responsePayload
  #server
  #socket

  constructor (command) {
    this.#command = command
    this.#sketchRoot = path.dirname(this.#command.filePath)

    this.#updateResponsePayload()
  }

  start () {
    const cc = new ColourfulConsole()
    const fileServer = new FileServer()

    this.#server = http.createServer((req, res) => {
      const handler = new RequestHandler(req, res)

      if (req.url === '/') {
        handler.handleOk(this.#responsePayload)
      } else {
        fileServer.handle(req, res, this.#sketchRoot)
      }
    })

    this.#server.on('upgrade', (req, socket) => {
      if (req.headers['upgrade'] !== 'websocket') {
        socket.end('HTTP/1.1 400 Bad request')

        return;
      }

      this.#socket = socket

      const socketKey = req.headers['sec-websocket-key']
      const responseHeaders = [
        'HTTP/1.1 101 Web Socket Protocol Handshake',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${this.#generateSocketKey(socketKey)}`
      ]

      const socketProtocols = req.headers['sec-websocket-protocol']?.split(',').map(p => p.trim())

      if (socketProtocols?.includes('json')) {
        responseHeaders.push('Sec-WebSocket-Protocol: json')
      }

      socket.on('data', this.#handleSocketRequest)
      socket.write(responseHeaders.join('\r\n') + '\r\n\r\n')
    })

    this.#server.listen(this.#command.portNumber, 'localhost', () => {
      const portNumber = this.#server.address().port

      cc.raw('\nServer running at ').cyan(`http://localhost:${portNumber}\n`).print()
    })

    this.#watchFileForChanges()
  }

  #updateResponsePayload () {
    try {
      const sketchFileContent = fs.readFileSync(this.#command.filePath, 'utf8')
      const template = fs.readFileSync(path.resolve(__dirname + '/../templates/index.html'), 'utf8')

      this.#responsePayload = template.replace('//= sketch code', sketchFileContent)
      this.#responsePayload = this.#responsePayload.replace('//= module_imports', this.#getModuleImports())
    } catch (error) {
      console.error(error)
      this.#server.close()
    }
  }

  #watchFileForChanges () {
    const cc = new ColourfulConsole()

    fs.watch(this.#command.filePath, (event, fileName) => {
      if (fileName && event === 'change') {
        this.#updateResponsePayload()

        try {
          this.#socket.write(this.#constructSocketMessage({ action: 'reload' }))
        } catch (error) {
          cc.red('\nCould not write to the socket\n\n').print()
          console.error(error)
        }
      }
    })
  }

  #generateSocketKey (key) {
    return crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary').digest('base64')
  }

  #constructSocketMessage (message) {
    const json = JSON.stringify(message)
    const byteLength = Buffer.byteLength(json)
    const lengthByteCount = byteLength < 126 ? 0 : 2
    const payloadLength = lengthByteCount === 0 ? byteLength : 126
    const buffer = Buffer.alloc(2 + lengthByteCount + byteLength)

    let payloadOffset = 2

    buffer.writeUInt8(0b10000001, 0)
    buffer.writeUInt8(payloadLength, 1)

    if (lengthByteCount > 0) {
      buffer.writeUInt16BE(byteLength, 2)

      payloadOffset += lengthByteCount
    }

    buffer.write(json, payloadOffset)

    return buffer
  }

  #handleSocketRequest (data) {
    // TODO: handle client requests
  }

  #getModuleImports () {
    const sketchFileBaseName = path.basename(this.#command.filePath, '.js')
    const importMapPath = path.resolve(this.#sketchRoot, `${sketchFileBaseName}_packages.json`)

    let imports = ''

    if (fs.existsSync(importMapPath)) {
      const customImports = require(importMapPath)

      imports = Object.entries(customImports).reduce((result, [key, value]) => {
        result += `,\n"${key}": "${value}"`

        return result
      }, '')
    }

    return imports
  }
}

module.exports = Server
