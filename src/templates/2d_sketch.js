import CanvasSettings from 'canvas_settings'

const canvas = document.getElementById('sketch_canvas')
const canvasSettings = new CanvasSettings('2d')

// canvasSettings.width = 1080
// canvasSettings.height = 1080

const context = canvas.getContext(canvasSettings.canvasContext)

canvasSettings.enableExport(canvas)

// NOTE: this variable can be used for elapsed time calculations in the animate function.
// const startTime = Date.now()

function resizeCanvas() {
  canvas.width = canvasSettings.width
  canvas.height = canvasSettings.height
}

function draw() {
  // const elapsedTime = (Date.now() - startTime) / 1000

  context.fillStyle = 'white'

  context.fillRect(0, 0, canvasSettings.width, canvasSettings.height)

  context.fillStyle = 'black'

  const cellCount = 5
  const cellWidth = canvasSettings.width / cellCount
  const cellHeight = canvasSettings.height / cellCount
  const horizontalOffset = cellWidth / 2
  const verticalOffset = cellHeight / 2

  for (let i = 0; i < cellCount; i++) {
    for (let j = 0; j < cellCount; j++) {
      context.beginPath()
      context.arc(cellWidth * i + horizontalOffset, cellHeight * j + verticalOffset, 4, 0, Math.PI * 2)
      context.fill()
    }
  }

  // requestAnimationFrame(draw)
}

resizeCanvas()
draw()

window.addEventListener('resize', () => {
  resizeCanvas()
  draw()
})
