import { exportVideo, exportPNG } from 'exporter'
import { calculateSizeInPX } from 'canvas_size'

class CanvasSettings {
  #width = window.innerWidth
  #height = window.innerHeight
  #fullWidth = true
  #fullHeight = true

  aspectRatio = 1
  exportAs = 'image'
  duration = 5000
  canvasContextType = 'webgl'
  dpi = 300
  orientation = 'portrait'
  elementWidth = 0
  elementHeight = 0

  constructor(contextType) {
    if (contextType) {
      this.canvasContextType = contextType
    }

    this.updateElementSizes()
    this.updateAspectRatio()

    window.addEventListener('resize', () => {
      this.updateElementSizes()
      this.updateAspectRatio()
    })
  }

  get width () {
    return this.#width
  }

  set width (value) {
    this.#width = value
    this.#fullWidth = false

    this.updateElementSizes()
    this.updateAspectRatio()
  }

  get height () {
    return this.#height
  }

  set height (value) {
    this.#height = value
    this.#fullHeight = false

    this.updateElementSizes()
    this.updateAspectRatio()
  }

  set size(sizeFormatName) {
    let [width, height] = calculateSizeInPX(sizeFormatName, this.dpi)

    if (this.orientation == 'landscape') {
      [width, height] = [height, width]
    }

    this.#width = width
    this.#height = height
    this.#fullWidth = false
    this.#fullHeight = false

    this.updateElementSizes()
    this.updateAspectRatio()
  }

  set ppi(value) {
    this.dpi = value
  }

  updateAspectRatio () {
    this.aspectRatio = this.#width / this.#height
  }

  updateElementSizes() {
    if (this.#fullWidth) {
      this.#width = window.innerWidth
    }

    if (this.#fullHeight) {
      this.#height = window.innerHeight
    }

    let width = this.elementWidth
    let height = this.elementHeight

    if (width == 0) {
      width = this.#width
    }

    if (height == 0) {
      height = this.#height
    }

    if (width < this.#width) {
      width = this.#width
    }

    if (width > window.innerWidth) {
      width = window.innerWidth
    }

    if (height < this.#height) {
      height = this.#height
    }

    if (height > window.innerHeight) {
      height = window.innerHeight
    }

    if (!this.#fullWidth && this.#width < this.#height) {
      width = Math.round(height * this.aspectRatio)
    }

    if (!this.#fullHeight && this.#height < this.#width) {
      height = Math.round(width / this.aspectRatio)
    }

    this.elementWidth = width
    this.elementHeight = height
  }

  enableExport (canvas, renderer, scene, camera) {
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key == 's') {
        event.preventDefault()

        if (this.exportAs.startsWith('video/')) {
          exportVideo(canvas, this.duration, this.exportAs)
        } else {
          try {
            if (this.canvasContextType === 'webgl') {
              exportPNG(canvas, { renderer, scene, camera })
            } else {
              exportPNG(canvas)
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    }, false)
  }
}

export default CanvasSettings
