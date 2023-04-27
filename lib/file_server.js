const fs = require('fs')
const path = require('path')

const RequestHandler = require('./request_handler')

class FileServer {
  #SUPPORTED_FILE_TYPES = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    json: 'application/json',
    xml: 'application/xml'
  }

  handle (request, response, sketchRootPath) {
    const handler = new RequestHandler(request, response)
    const fileExtenstion = path.extname(request.url).slice(1)
    const contentType = this.#SUPPORTED_FILE_TYPES[fileExtenstion] || this.#SUPPORTED_FILE_TYPES.html
    const libraryAssetPath = path.join(__dirname, request.url.replace('lib-', '../'))
    const assetPath = path.join(sketchRootPath, request.url)

    let filePath

    if (fs.existsSync(assetPath)) {
      filePath = assetPath
    } else if (fs.existsSync(libraryAssetPath)) {
      filePath = libraryAssetPath
    }

    if (filePath) {
      fs.readFile(filePath, (error, data) => {
        if (error) {
          handler.handleNotFound()
        } else {
          handler.handleOk(data, contentType)
        }
      })
    } else {
      handler.handleNotFound()
    }
  }
}

module.exports = FileServer
