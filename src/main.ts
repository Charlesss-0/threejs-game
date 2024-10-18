import './style.css'

import * as THREE from 'three'

import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Player } from './player'
import Stats from 'three/addons/libs/stats.module.js'
import { World } from './world'

class MainScene {
	private canvas: HTMLCanvasElement = document.getElementById('main-scene') as HTMLCanvasElement
	private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: this.canvas })
	private scene: THREE.Scene = new THREE.Scene()
	private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
		75,
		this.canvas.clientWidth / this.canvas.clientHeight,
		0.1,
		1000
	)
	private controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
	private stats: Stats = new Stats()
	private gui: GUI = new GUI()
	private world: World = new World(10, 10)
	private player: Player = new Player(this.camera, this.world)

	constructor() {
		this.createScene()

		this.scene.add(this.world)
		this.scene.add(this.player)

		this.requestAnimation = this.requestAnimation.bind(this)
		window.addEventListener('resize', this.onWindowResize.bind(this))
	}

	private createScene() {
		this.setupRenderer()
		this.setupCamera()
		this.setupLights()
		this.setupControls()
		this.setupStats()
		this.setupGUI()
	}

	private setupRenderer() {
		this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio)
	}

	private setupCamera() {
		this.camera.position.set(0, 2, 0)
	}

	private setupLights() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 1)
		const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
		directionalLight.position.set(4, 5, 4)
		this.scene.add(directionalLight, ambientLight)
	}

	private setupControls() {
		this.controls.target.set(5, 0.5, 5)
		this.controls.enableDamping = true
		this.controls.dampingFactor = 0.25
		this.controls.enablePan = false
		this.controls.enableRotate = true
		this.controls.update()
	}

	private setupStats() {
		document.body.appendChild(this.stats.dom)
	}

	private setupGUI() {
		const worldFolder = this.gui.addFolder('Terrain')
		worldFolder.add(this.world, 'width', 1, 40, 1).name('Height')
		worldFolder.add(this.world, 'height', 1, 40, 1).name('Width')
		worldFolder.add(this.world, 'treeCount', 1, 50, 1).name('Trees')
		worldFolder.add(this.world, 'rockCount', 1, 50, 1).name('Rocks')
		worldFolder.add(this.world, 'bushCount', 1, 50, 1).name('Bushes')
		worldFolder.add(this.world, 'generateWorld').name('Generate World')
	}

	public onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	public requestAnimation() {
		requestAnimationFrame(this.requestAnimation)

		this.controls.update()
		this.stats.update()

		this.renderer.render(this.scene, this.camera)
	}
}

const mainScene = new MainScene()
mainScene.requestAnimation()
