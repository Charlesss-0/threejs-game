import './style.css'

import * as THREE from 'three'

import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'

const gui = new GUI()

// stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// renderer setup
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(canvas.clientWidth, canvas.clientHeight)

// scene setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)

// light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight, ambientLight)

// geometry and material setup
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x00eeff })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
camera.position.z = 5

// controls setup
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.enablePan = false
controls.enableRotate = true
controls.update()

// animation loop
function animate() {
	requestAnimationFrame(animate)

	controls.update()
	stats.update()

	renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})

const folder = gui.addFolder('Cube')
folder.add(cube.position, 'x', -2, 2, 0.1).name('X')
folder.addColor(cube.material, 'color')

animate()
