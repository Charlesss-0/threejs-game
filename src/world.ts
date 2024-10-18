import * as THREE from 'three'

export class World extends THREE.Group {
	private textureLoader = new THREE.TextureLoader()
	private gridTexture: THREE.Texture = this.textureLoader.load('textures/grid.png')
	private positionMap = new Map<string, { position: THREE.Vector2; radius: number }>()
	public terrain: THREE.Mesh = new THREE.Mesh()
	public width: number
	public height: number
	public treeCount: number
	public rockCount: number
	public bushCount: number
	private trees: THREE.Group = new THREE.Group()
	private rocks: THREE.Group = new THREE.Group()
	private bushes: THREE.Group = new THREE.Group()

	private getKey = (coords: THREE.Vector2) => `${coords.x}-${coords.y}`

	constructor(width: number, height: number) {
		super()

		this.width = width
		this.height = height
		this.treeCount = 20
		this.rockCount = 20
		this.bushCount = 20

		this.generateWorld()
	}

	public generateWorld() {
		this.createTerrain()
		this.createTrees()
		this.createRocks()
		this.createBushes()
	}

	private clearTerrain() {
		if (this.terrain) {
			this.terrain.geometry.dispose()
			this.remove(this.terrain)
		}

		if (this.trees) {
			this.trees.children.forEach(tree => {
				if (tree instanceof THREE.Mesh) {
					tree.geometry?.dispose()
					tree.material?.dispose()
				}
			})
			this.trees.clear()
		}

		if (this.rocks) {
			this.rocks.children.forEach(rock => {
				if (rock instanceof THREE.Mesh) {
					rock.geometry?.dispose()
					rock.material?.dispose()
				}
			})
			this.rocks.clear()
		}

		if (this.bushes) {
			this.bushes.children.forEach(bush => {
				if (bush instanceof THREE.Mesh) {
					bush.geometry?.dispose()
					bush.material?.dispose()
				}
			})
			this.bushes.clear()
		}

		this.positionMap.clear()
	}

	createTerrain() {
		this.clearTerrain()

		this.gridTexture.repeat = new THREE.Vector2(this.width, this.height)
		this.gridTexture.wrapS = THREE.RepeatWrapping
		this.gridTexture.wrapT = THREE.RepeatWrapping
		this.gridTexture.colorSpace = THREE.SRGBColorSpace

		const terrainMaterial = new THREE.MeshStandardMaterial({
			map: this.gridTexture,
		})

		const terrainGeometry = new THREE.BoxGeometry(this.width, 0.1, this.height)

		this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
		this.terrain.name = 'Terrain'
		this.terrain.position.set(this.width / 2, -0.05, this.height / 2)
		this.add(this.terrain)
	}

	private isPositionValid(newPos: THREE.Vector2, radius: number) {
		for (let [_key, value] of this.positionMap) {
			const { position: existingPos, radius: existingRadius } = value
			const distance = newPos.distanceTo(existingPos)

			if (distance < radius + existingRadius) {
				return false
			}
		}

		return true
	}

	private createTrees() {
		const treeRadius = 0.2
		const treeHeight = 1

		const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a5319, flatShading: true })

		for (let i = 0; i < this.treeCount; i++) {
			const treeGeometry = new THREE.ConeGeometry(treeRadius, treeHeight, 8)
			const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial)

			let coords: THREE.Vector2

			do {
				coords = new THREE.Vector2(
					Math.floor(this.width * Math.random()),
					Math.floor(this.height * Math.random())
				)
			} while (!this.isPositionValid(coords, treeRadius))

			treeMesh.position.set(coords.x + 0.5, treeHeight / 2, coords.y + 0.5)

			this.trees.add(treeMesh)
			this.positionMap.set(this.getKey(coords), {
				position: coords,
				radius: treeRadius,
			})
		}

		this.add(this.trees)
	}

	private createRocks() {
		const minRockRadius = 0.1
		const maxRockRadius = 0.3
		const minRockHeight = 0.5
		const maxRockHeight = 0.8

		const rockMaterial = new THREE.MeshStandardMaterial({ color: 0xb7b7b7, flatShading: true })

		for (let i = 0; i < this.rockCount; i++) {
			const rockRadius = minRockRadius + Math.random() * (maxRockRadius - minRockRadius)
			const rockHeight = minRockHeight + Math.random() * (maxRockHeight - minRockHeight)

			const rockGeometry = new THREE.SphereGeometry(rockRadius, 6, 5)
			const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial)

			let coords: THREE.Vector2

			do {
				coords = new THREE.Vector2(
					Math.floor(Math.random() * this.width),
					Math.floor(Math.random() * this.height)
				)
			} while (!this.isPositionValid(coords, rockRadius))

			rockMesh.position.set(coords.x + 0.5, 0, coords.y + 0.5)
			rockMesh.scale.y = rockHeight
			this.rocks.add(rockMesh)
			this.positionMap.set(this.getKey(coords), {
				position: coords,
				radius: rockRadius,
			})
		}

		this.add(this.rocks)
	}

	private createBushes() {
		const minBushRadius = 0.1
		const maxBushRadius = 0.3

		const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x87a922, flatShading: true })

		for (let i = 0; i < this.bushCount; i++) {
			const bushRadius = minBushRadius + Math.random() * (maxBushRadius - minBushRadius)

			const bushGeometry = new THREE.SphereGeometry(bushRadius, 10, 10)
			const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial)

			let coords: THREE.Vector2

			do {
				coords = new THREE.Vector2(
					Math.floor(Math.random() * this.width),
					Math.floor(Math.random() * this.height)
				)
			} while (!this.isPositionValid(coords, bushRadius))

			bushMesh.position.set(coords.x + 0.5, bushRadius / 2, coords.y + 0.5)
			this.bushes.add(bushMesh)
			this.positionMap.set(this.getKey(coords), {
				position: coords,
				radius: bushRadius,
			})
		}

		this.add(this.bushes)
	}

	public getObject(coords: THREE.Vector2) {
		return this.positionMap.get(this.getKey(coords)) ?? null
	}
}
