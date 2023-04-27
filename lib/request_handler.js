const ColourfulConsole = require('./colourful_console')

class RequestHandler {
  #request
  #response

  constructor (request, response) {
    this.#request = request
    this.#response = response
  }

  static get METHOD () {
    return {
      GET: 'GET'
    }
  }

  handleOk (payload, contentType = 'text/html; charset=utf-8', method = this.constructor.METHOD.GET) {
    const cc = new ColourfulConsole()

    cc.green(`${method} `).raw(this.#request.url).green(' 200').print()

    this.#response.statusCode = 200

    this.#response.setHeader('Content-Type', contentType)
    this.#response.end(payload)
  }

  handleNotFound (method = this.constructor.METHOD.GET) {
    const cc = new ColourfulConsole()

    cc.red(`${method} `).raw(this.#request.url).red(' 404').print()

    this.#response.statusCode = 404

    this.#response.setHeader('Content-Type', 'text/html; charset=utf-8')
    this.#response.end('404: File not found')
  }
}

module.exports = RequestHandler
