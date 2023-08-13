import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// NOTE: do not rename the scene, camera and renderer variables if you are going to use the save function!
const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera()
const renderer = new THREE.WebGLRenderer({ canvas })
const controls = new OrbitControls(camera, canvas)

// CANVAS_SETTINGS.width = 1080
// CANVAS_SETTINGS.height = 1080

renderer.setSize(CANVAS_SETTINGS.width, CANVAS_SETTINGS.height)
renderer.setClearColor('white', 1)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 'red' })
const cube = new THREE.Mesh(geometry, material)
const light = new THREE.DirectionalLight('white', 1)
const ambientLight = new THREE.AmbientLight('hsl(0, 0%, 25%)')

scene.add(cube)

const zoom = 2

camera.left = -zoom * CANVAS_SETTINGS.aspectRatio
camera.right = zoom * CANVAS_SETTINGS.aspectRatio
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

// NOTE: this variable can be used for elapsed time calculations in the animate function.
// const startTime = Date.now()

function animate () {
  // const elapsedTime = (Date.now() - startTime) / 1000

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

window.addEventListener('resize', () => {
  camera.left = -zoom * CANVAS_SETTINGS.aspectRatio
  camera.right = zoom * CANVAS_SETTINGS.aspectRatio

  camera.updateProjectionMatrix()
  renderer.setSize(CANVAS_SETTINGS.width, CANVAS_SETTINGS.height)
  animate()
})

animate()
