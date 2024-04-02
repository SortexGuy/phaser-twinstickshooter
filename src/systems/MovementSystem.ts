import { Position, Velocity } from '../components';

import { defineQuery, defineSystem, enterQuery, exitQuery } from 'bitecs';

export function createMovementSystem(scene: Phaser.Scene) {
	const movementQuery = defineQuery([Position, Velocity]);

	return defineSystem((world) => {
		const entities = movementQuery(world);
		entities.forEach((entityID) => {
			// Set body velocity
			const vel = { x: Velocity.x[entityID], y: Velocity.y[entityID] };
			Position.x[entityID] += vel.x;
			Position.y[entityID] += vel.y;
		});

		return world;
	});
}
