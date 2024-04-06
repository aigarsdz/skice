const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const ColourfulText = require('./colourful_text')
const FileChangeEmitter = require('./file_change_emitter')

const SUPPORTED_FILE_TYPES = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  json: 'application/json',
  xml: 'application/xml',
  glsl: 'text/plain'
}

class Server {
  #command;
  #server;
  #sockets = []
  #fileWatcher;
  #fileChangeEmitter = new FileChangeEmitter()
  #filesAreBeingWatched = false

  constructor(command) {
    this.#command = command
    this.#server = http.createServer((request, response) => {
      if (request.url == '/') {
        this.#respondWithRoot(request, response)
      } else {
        this.#respondWithFile(request, response)
      }
    })

    process.on('SIGINT', () => {
      if (this.#fileWatcher) {
        this.#fileWatcher.close()
      }

      process.exit(1)
    })

    this.#fileChangeEmitter.on('change', this.#sendReloadMessage.bind(this))
  }

  start() {
    const ct = new ColourfulText()

    this.#addWebSocketConnection()
    this.#server.listen(this.#command.portNumber, 'localhost', () => {
      console.info(ct.default("\nServer running at ").cyan(`http://localhost:${this.#command.portNumber}\n`).value)
    })

    this.#watchFilesForChanges()
  }

  #respondWithRoot(request, response) {
    const ct = new ColourfulText()
    let payload = ''

    try {
      payload = fs.readFileSync(path.join(this.#command.currentDirtectory, 'index.html'))
    } catch (error) {
      console.error(error)
    }

    this.#respondWithOK(request, response, payload, SUPPORTED_FILE_TYPES.html)
  }

  #respondWithFile(request, response) {
    const fileExtenstion = path.extname(request.url).slice(1)
    const contentType = SUPPORTED_FILE_TYPES[fileExtenstion] || SUPPORTED_FILE_TYPES.txt
    const filePath = path.join(this.#command.currentDirtectory, request.url)

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, (error, data) => {
        if (error) {
          this.#respondWithNotFound(request, response)
        } else {
          this.#respondWithOK(request, response, data, contentType)
        }
      })
    } else {
      this.#respondWithNotFound(request, response)
    }
  }

  #respondWithOK(request, response, payload, contentType) {
    const ct = new ColourfulText()

    console.info(ct.bold().green('GET ').default(request.url).value)

    response.statusCode = 200

    response.setHeader('Content-Type', contentType)
    response.end(payload)
  }

  #respondWithNotFound(request, response) {
    const ct = new ColourfulText()

    console.info(ct.bold().red('GET ').default(request.url).value)

    response.statusCode = 404

    response.setHeader('Content-Type', SUPPORTED_FILE_TYPES.txt)
    response.end('404: File not found')
  }

  #addWebSocketConnection() {
    this.#server.on('upgrade', (request, socket) => {
      if (request.headers['upgrade'] !== 'websocket') {
        socket.end('HTTP/1.1 400 Bad request')

        return
      }

      const socketKey = request.headers['sec-websocket-key']
      const responseHeaders = [
        'HTTP/1.1 101 Web Socket Protocol Handshake',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${this.#generateSocketKey(socketKey)}`
      ]

      const socketProtocols = request.headers['sec-websocket-protocol']?.split(',').map(p => p.trim())

      this.#sockets.push(socket)

      if (socketProtocols?.includes('json')) {
        responseHeaders.push('Sec-WebSocket-Protocol: json')
      }

      socket.on('end', () => this.#closeSocket(socket))
      socket.on('error', error => {
        if (error.message == 'write ECONNABORTED') {
          this.#closeSocket(socket)
        }
      })

      socket.write(responseHeaders.join('\r\n') + '\r\n\r\n')
    })
  }

  #generateSocketKey(key) {
    return crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary').digest('base64')
  }

  #watchFilesForChanges() {
    this.#fileWatcher = fs.watch(this.#command.currentDirtectory, { recursive: true }, (event, filePath) => {
      if (filePath && event === 'change' && this.#filesAreBeingWatched) {
        this.#fileChangeEmitter.addChange(filePath)
      }
    })

    this.#filesAreBeingWatched = true
  }

  #sendReloadMessage() {
    const ct = new ColourfulText()
    const outdatedSockets = []

    console.info(ct.blue('Reloading the browser after a file change.').value)

    this.#sockets.forEach(socket => {
      socket.write(this.#constructSocketMessage({ action: 'reload' }))
      outdatedSockets.push(socket)
    })

    outdatedSockets.forEach(socket => this.#closeSocket(socket))
  }

  #constructSocketMessage(message) {
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

  #closeSocket(socket) {
    const socketIndex = this.#sockets.findIndex(openSocket => openSocket === socket)

    if (socketIndex > -1) {
      this.#sockets[socketIndex].close()
      this.#sockets.splice(socketIndex, 1)
    }
  }
}

module.exports = Server
