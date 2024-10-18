import * as THREE from 'three'

import { World } from './world'

const getKey = (coords: THREE.Vector2) => `${coords.x}-${coords.y}`

export function search(start: THREE.Vector2, end: THREE.Vector2, world: World) {
	if (start.x === end.x && start.y === end.y) return []

	let pathFound = false
	const maxSearchDistance = 20

	const cameFrom = new Map<string, THREE.Vector2>()
	const cost = new Map<string, number>()
	const frontier = [start]
	cost.set(getKey(start), 0)

	let counter = 0

	while (frontier.length > 0) {
		frontier.sort((v1, v2) => {
			const g1 = start.manhattanDistanceTo(v1)
			const g2 = start.manhattanDistanceTo(v2)
			const h1 = v1.manhattanDistanceTo(end)
			const h2 = v2.manhattanDistanceTo(end)
			const f1 = g1 + h1
			const f2 = g2 + h2
			return f1 - f2
		})

		const candidate = frontier.shift()

		counter++

		if (candidate && candidate.x === end.x && candidate.y === end.y) {
			pathFound = true
			break
		}

		if (candidate && candidate.manhattanDistanceTo(start) > maxSearchDistance) continue

		const neighbors = getNeighbors(candidate!, world, cost)
		frontier.push(...neighbors)

		neighbors.forEach(neighbor => {
			cameFrom.set(getKey(neighbor), candidate!)
		})
	}

	if (!pathFound) return null

	let curr = end
	const path = [curr]

	while (getKey(curr) !== getKey(start)) {
		const prev = cameFrom.get(getKey(curr))
		path.push(prev!)
		curr = prev!
	}

	path.reverse()
	path.shift()

	return path
}

export function getNeighbors(coords: THREE.Vector2, world: World, cost: Map<string, number>) {
	let neighbors = []

	// left
	if (coords.x > 0) {
		neighbors.push(new THREE.Vector2(coords.x - 1, coords.y))
	}

	// right
	if (coords.x < world.width - 1) {
		neighbors.push(new THREE.Vector2(coords.x + 1, coords.y))
	}

	// top
	if (coords.y > 0) {
		neighbors.push(new THREE.Vector2(coords.x, coords.y - 1))
	}

	// bottom
	if (coords.y < world.height - 1) {
		neighbors.push(new THREE.Vector2(coords.x, coords.y + 1))
	}

	const newCost = cost.get(getKey(coords))! + 1

	neighbors = neighbors
		.filter(coords => {
			if (!cost.has(getKey(coords)) || newCost < cost.get(getKey(coords))!) {
				cost.set(getKey(coords), newCost)
				return true
			} else {
				return false
			}
		})
		.filter(coords => !world.getObject(coords))

	return neighbors
}
