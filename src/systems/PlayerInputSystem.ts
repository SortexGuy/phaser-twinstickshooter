import { Player, Velocity } from '../components';

import { defineQuery, defineSystem } from 'bitecs';

export type PlayerInput = {
	up: Phaser.Input.Keyboard.Key;
	down: Phaser.Input.Keyboard.Key;
	left: Phaser.Input.Keyboard.Key;
	right: Phaser.Input.Keyboard.Key;
	// shoot: Phaser.Input.Keyboard.Key;
	// shift: Phaser.Input.Keyboard.Key;
};

export function createPlayerInputSystem(inputs: PlayerInput) {
	const playerInputQuery = defineQuery([Player, Velocity]);

	return defineSystem((world) => {
		const entities = playerInputQuery(world);
		entities.forEach((entityID) => {
			// Movement
			const dir: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
				(inputs.left.isDown ? -1 : 0) + (inputs.right.isDown ? 1 : 0),
				(inputs.up.isDown ? -1 : 0) + (inputs.down.isDown ? 1 : 0),
			).normalize();
			const speed = 130;
			Velocity.x[entityID] = dir.x * speed;
			Velocity.y[entityID] = dir.y * speed;
		});

		return world;
	});
}
