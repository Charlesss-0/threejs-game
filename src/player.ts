import * as THREE from 'three'

export class Player extends THREE.Mesh {
	constructor() {
		super()

		this.geometry = new THREE.CapsuleGeometry(0.25, 0.5)
		this.material = new THREE.MeshStandardMaterial({ color: 0x4040c0, flatShading: true })
		this.position.set(5.5, 0.5, 5.5)
	}
}
