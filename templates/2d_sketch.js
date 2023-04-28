CANVAS_SETTINGS.canvasContext = CanvasSettings.CONTEXT.canvas2d
// CANVAS_SETTINGS.width = 1080
// CANVAS_SETTINGS.height = 1080

const context = canvas.getContext(CANVAS_SETTINGS.canvasContext)

// NOTE: this variable can be used for elapsed time calculations in the animate function.
// const startTime = Date.now()

function resizeCanvas () {
  canvas.width = CANVAS_SETTINGS.width
  canvas.height = CANVAS_SETTINGS.height
}

function draw () {
  // const elapsedTime = (Date.now() - startTime) / 1000

  context.fillStyle = 'white'

  context.fillRect(0, 0, CANVAS_SETTINGS.width, CANVAS_SETTINGS.height)

  context.fillStyle = 'black'

  const cellCount = 5
  const cellWidth = CANVAS_SETTINGS.width / cellCount
  const cellHeight = CANVAS_SETTINGS.height / cellCount
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
