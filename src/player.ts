import * as THREE from 'three'

import { World } from './world'
import { search } from './path-finder'

export class Player extends THREE.Mesh {
	public raycaster: THREE.Raycaster = new THREE.Raycaster()
	public camera: THREE.PerspectiveCamera
	public world: World

	constructor(camera: THREE.PerspectiveCamera, world: World) {
		super()

		this.geometry = new THREE.CapsuleGeometry(0.25, 0.5)
		this.material = new THREE.MeshStandardMaterial({ color: 0x4040c0, flatShading: true })
		this.position.set(5.5, 0.5, 5.5)

		this.camera = camera
		this.world = world

		window.addEventListener('mousedown', this.onMouseDown.bind(this))
	}

	onMouseDown(event: MouseEvent) {
		const coords = new THREE.Vector2(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 - 1
		)
		this.raycaster.setFromCamera(coords, this.camera)

		const intersections = this.raycaster.intersectObject(this.world.terrain)

		if (intersections.length > 0) {
			const intersection = intersections[0]
			const selectedCoords = new THREE.Vector2(
				Math.floor(intersection.point.x),
				Math.floor(intersection.point.z)
			)

			this.position.set(selectedCoords.x + 0.5, 0.5, selectedCoords.y + 0.5)

			search(selectedCoords, null, this.world)
		}
	}
}
