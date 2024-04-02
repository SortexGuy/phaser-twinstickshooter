import { ArcadeSprite, Player, Position, Velocity } from '../components';

import { defineQuery, defineSystem, enterQuery, exitQuery } from 'bitecs';

export function createArcadeSpriteSystem(
	group: Phaser.Physics.Arcade.Group,
	textures: string[],
	camera: Phaser.Cameras.Scene2D.Camera,
) {
	const arcadeSpritesByID: Map<number, Phaser.Physics.Arcade.Image> = new Map();
	const arcadeSpriteQuery = defineQuery([ArcadeSprite, Position, Velocity]);
	const arcadeSpriteQueryEnter = enterQuery(arcadeSpriteQuery);
	const arcadeSpriteQueryExit = exitQuery(arcadeSpriteQuery);

	const playerSpriteQuery = defineQuery([Player, ArcadeSprite]);
	const playerSpriteQueryEnter = enterQuery(playerSpriteQuery);

	return defineSystem((world) => {
		const enterEntities = arcadeSpriteQueryEnter(world);
		enterEntities.forEach((entityID) => {
			const imgID = ArcadeSprite.texture[entityID];
			const pos = { x: Position.x[entityID], y: Position.y[entityID] };

			const sprite = group.get(pos.x, pos.y, textures[imgID]);
			arcadeSpritesByID.set(entityID, sprite);
		});

		const enterPlayerEntities = playerSpriteQueryEnter(world);
		enterPlayerEntities.forEach((entityID) => {
			const sprite = arcadeSpritesByID.get(entityID);
			if (!sprite) return;

			sprite.setDepth(100);
			camera.startFollow(sprite).setZoom(2.4);
		});

		const entities = arcadeSpriteQuery(world);
		entities.forEach((entityID) => {
			const arcadeSprite = arcadeSpritesByID.get(entityID);
			if (!arcadeSprite) return;

			// Set body velocity
			const vel = { x: Velocity.x[entityID], y: Velocity.y[entityID] };
			arcadeSprite.setVelocity(vel.x, vel.y);
		});

		const exitEntities = arcadeSpriteQueryExit(world);
		exitEntities.forEach((entityID) => {
			const arcadeSprite = arcadeSpritesByID.get(entityID);
			if (!arcadeSprite) return;

			group.killAndHide(arcadeSprite);
			arcadeSpritesByID.delete(entityID);
		});

		return world;
	});
}
