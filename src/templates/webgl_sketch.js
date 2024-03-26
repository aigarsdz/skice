import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import CanvasSettings from 'canvas_settings'

const canvas = document.getElementById('sketch_canvas')
const canvasSettings = new CanvasSettings()
const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera()
const renderer = new THREE.WebGLRenderer({ canvas })
const controls = new OrbitControls(camera, canvas)

// canvasSettings.width = 1080
// canvasSettings.height = 1080

canvasSettings.enableExport(canvas, renderer, scene, camera)
renderer.setSize(canvasSettings.width, canvasSettings.height)
renderer.setClearColor('white', 1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 'red' })
const cube = new THREE.Mesh(geometry, material)
const light = new THREE.DirectionalLight('white', 1)
const ambientLight = new THREE.AmbientLight('hsl(0, 0%, 25%)')

scene.add(cube)

const zoom = 2

camera.left = -zoom * canvasSettings.aspectRatio
camera.right = zoom * canvasSettings.aspectRatio
camera.top = zoom
camera.bottom = -zoom
camera.near = -100
camera.far = 100

camera.position.set(zoom, zoom, zoom)
camera.lookAt(new THREE.Vector3())
camera.updateProjectionMatrix()

light.position.set(2, 2, 4)

scene.add(light)
scene.add(ambientLight)

// NOTE: Uncomment the following lines to display scene helpers!
// scene.add(new THREE.GridHelper(5, 50))
// scene.add(new THREE.AxesHelper(5))
// scene.add(new THREE.DirectionalLightHelper(light, 0.25, 0x000000))

function animate () {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

window.addEventListener('resize', () => {
  camera.left = -zoom * canvasSettings.aspectRatio
  camera.right = zoom * canvasSettings.aspectRatio

  camera.updateProjectionMatrix()
  renderer.setSize(canvasSettings.width, canvasSettings.height)
})

animate()
