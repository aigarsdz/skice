export function exportWebM (canvas, duration, type) {
  const chunks = []
  const stream = canvas.captureStream()
  const recorder = new MediaRecorder(stream)

  recorder.ondataavailable = event => chunks.push(event.data)
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type })
    const video = document.createElement('video')
    const downloadLink = document.createElement('a')

    video.style.display = 'none'
    video.src = URL.createObjectURL(blob)
    downloadLink.style.display = 'none'

    document.body.appendChild(video)

    downloadLink.download = 'sketch.webm'
    downloadLink.href = video.src
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    document.body.removeChild(video)
  }

  recorder.start()
  setTimeout(() => recorder.stop(), duration)
}

export function exportPNG (canvas, renderer = null) {
  const link = document.createElement('a')

  if (renderer) {
    renderer.render(scene, camera)
    link.href = renderer.domElement.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  } else {
    link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  }

  link.style.display = 'none'

  link.setAttribute('download', 'sketch.png')

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
