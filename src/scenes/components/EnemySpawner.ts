import { Player } from './Player';

export class EnemySpawner {
	private spawn_points: Phaser.GameObjects.Sprite[];
	private spawn_timer: Phaser.Time.TimerEvent;
	private enemies: Enemy[] = [];
	physics: Phaser.Physics.Arcade.ArcadePhysics;
	player: Player;
	scene_man: Phaser.Scenes.ScenePlugin;

	constructor(
		spawn_points: Phaser.GameObjects.Sprite[],
		spawn_timer: Phaser.Time.TimerEvent,
		player: Player,
		physics: Phaser.Physics.Arcade.ArcadePhysics,
		scene_man: Phaser.Scenes.ScenePlugin,
	) {
		this.spawn_points = spawn_points;
		this.spawn_timer = spawn_timer;
		this.player = player;
		this.physics = physics;
		this.scene_man = scene_man;

		this.spawn_timer.callback = () => {
			const pos =
				this.spawn_points[
					Phaser.Math.Between(0, this.spawn_points.length - 1)
				].getCenter();
			this.enemies.push(
				new Enemy(
					this.physics.add
						.image(pos.x, pos.y, 'player')
						.setDepth(100)
						.setTint(0xddaa22),
					this,
				),
			);
		};
		this.spawn_timer.callbackScope = this;
	}
	destroy(target: Enemy) {
		let idx = this.enemies.indexOf(target);
		this.enemies = this.enemies.splice(idx);

		target.sprite.destroy();
	}

	update() {
		this.enemies.forEach((e) => e.update());
	}
}

class Enemy {
	sprite: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

	constructor(
		sprite: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
		manager: EnemySpawner,
	) {
		this.sprite = sprite;

		manager.physics.add.overlap(
			manager.player.sprite,
			this.sprite,
			() => {
				manager.player.handleHit(100);
			},
			undefined,
			this,
		);
	}

	update() {}
}
