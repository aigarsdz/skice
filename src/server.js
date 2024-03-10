const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const ColourfulText = require('./colourful_text')

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

  constructor (command) {
    this.#command = command
    this.#server = http.createServer((request, response) => {
      if (request.url == '/') {
        this.#respondWithRoot(request, response)
      } else {
        this.#respondWithFile(request, response)
      }
    })
  }

  start () {
    const ct = new ColourfulText()

    this.#server.listen(3000, 'localhost', () => {
      console.info(ct.default("\nServer running at ").cyan("http://localhost:3000\n").value)
    })
  }

  #respondWithRoot (request, response) {
    const ct = new ColourfulText()
    let payload = ''

    try {
      payload = fs.readFileSync(path.join(this.#command.currentDirtectory, 'index.html'))
    } catch (error) {
      console.error(error)
    }

    this.#respondWithOK(request, response, payload, SUPPORTED_FILE_TYPES.html)
  }

  #respondWithFile (request, response) {
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

  #respondWithOK (request, response, payload, contentType) {
    const ct = new ColourfulText()

    console.info(ct.bold().green('GET ').default(request.url).value)

    response.statusCode = 200

    response.setHeader('Content-Type', contentType)
    response.end(payload)
  }

  #respondWithNotFound (request, response) {
    const ct = new ColourfulText()

    console.info(ct.bold().red('GET ').default(request.url).value)

    response.statusCode = 404

    response.setHeader('Content-Type', SUPPORTED_FILE_TYPES.txt)
    response.end('404: File not found')
  }
}

module.exports = Server
