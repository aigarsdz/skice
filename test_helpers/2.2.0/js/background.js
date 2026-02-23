import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import CanvasSettings from 'canvas_settings'
import { importPlainText } from 'network'

const canvas = document.getElementById('sketch_canvas')
const canvasSettings = new CanvasSettings()
const scene = new THREE.Scene()
const camera = new THREE.OrthographicCamera()
const renderer = new THREE.WebGLRenderer({ canvas })
const controls = new OrbitControls(camera, canvas)
const vertexShader = await importPlainText('/shaders/vertex.glsl')
const fragmentShader = await importPlainText('/shaders/fragment.glsl')
const clock = new THREE.Clock()

canvasSettings.enableExport(canvas, renderer, scene, camera)
renderer.setSize(canvasSettings.width, canvasSettings.height)
renderer.setClearColor('white', 1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const geometry = new THREE.PlaneGeometry(20, 10)
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    resolution: new THREE.Uniform(new THREE.Vector2(canvasSettings.width, canvasSettings.height)),
    time: new THREE.Uniform(0)
  }
})
const background = new THREE.Mesh(geometry, material)

scene.add(background)

const zoom = 5

camera.left = -zoom * canvasSettings.aspectRatio
camera.right = zoom * canvasSettings.aspectRatio
camera.top = zoom
camera.bottom = -zoom
camera.near = -100
camera.far = 100

camera.lookAt(new THREE.Vector3())
camera.updateProjectionMatrix()

function animate() {
  material.uniforms.time.value = clock.getElapsedTime()

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
