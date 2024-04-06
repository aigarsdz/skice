import { exportVideo, exportPNG } from 'exporter'

class CanvasSettings {
  #width = window.innerWidth
  #height = window.innerHeight
  #initialWidth = window.innerWidth
  #initialHeight = window.innerHeight
  #fullWidth = true
  #fullHeight = true

  aspectRatio = 1
  exportAs = 'image'
  duration = 5000
  canvasContext = 'webgl'

  constructor(context) {
    if (context) {
      this.canvasContext = context
    }

    this.updateAspectRatio()

    window.addEventListener('resize', () => this.calculateSizes())
  }

  get width () {
    return this.#width
  }

  set width (value) {
    this.#width = value
    this.#initialWidth = value
    this.#fullWidth = false

    this.updateAspectRatio()
  }

  get height () {
    return this.#height
  }

  set height (value) {
    this.#height = value
    this.#initialHeight = value
    this.#fullHeight = false

    this.updateAspectRatio()
  }

  updateAspectRatio () {
    this.aspectRatio = this.#width / this.#height
  }

  calculateSizes () {
    if (this.#width > window.innerWidth || this.#fullWidth) {
      this.#width = window.innerWidth
    } else if (this.#width < this.#initialWidth) {
      const widthDifference = window.innerWidth - this.#width

      this.#width = Math.min(this.#width + widthDifference, this.#initialWidth)
    }

    if (this.#height > window.innerHeight || this.#fullHeight) {
      this.#height = window.innerHeight
    } else if (this.#height < this.#initialHeight) {
      const heightDifference = window.innerHeight - this.#height

      this.#height = Math.min(this.#height + heightDifference, this.#initialHeight)
    }

    this.updateAspectRatio()
  }

  enableExport (canvas, renderer, scene, camera) {
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key == 's') {
        event.preventDefault()

        if (this.exportAs.startsWith('video/')) {
          exportVideo(canvas, this.duration, this.exportAs)
        } else {
          try {
            if (this.canvasContext === 'webgl') {
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
