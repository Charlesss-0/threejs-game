import * as THREE from 'three'

import { World } from './world'

export function search(start: THREE.Vector2, end: THREE.Vector2, world: World) {
	const worldObj = world.getObject(start)
	console.log(worldObj)
}
