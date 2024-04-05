import { GroupConfig, SpriteConfig } from '../scenes/Game';
import { Player } from './Player';

export class EnemySpawner extends Phaser.Physics.Arcade.Group {
	private spawn_points: Phaser.GameObjects.Sprite[];
	private spawn_timer: Phaser.Time.TimerEvent;
	private player: Player;

	constructor(
		config: GroupConfig,
		spawn_points: Phaser.GameObjects.Sprite[],
		spawn_timer: Phaser.Time.TimerEvent,
		player: Player,
	) {
		super(config.world, config.scene);
		this.spawn_points = spawn_points;
		this.spawn_timer = spawn_timer;
		this.player = player;

		this.spawn_timer.callback = () => {
			const pos =
				this.spawn_points[
					Phaser.Math.Between(0, this.spawn_points.length - 1)
				].getCenter();

			const enemy = new Enemy(
				{ scene: this.scene, x: pos.x, y: pos.y },
				this.player,
			);
			this.add(enemy, true);
		};
		this.spawn_timer.callbackScope = this;
	}

	preUpdate(time: number, delta: number): void {
		super.preUpdate(time, delta);
		this.children.each((e) => {
			e.update();
			return null;
		});
	}
}

export class Enemy extends Phaser.Physics.Arcade.Image {
	private target: Player;

	constructor(config: SpriteConfig, target: Player) {
		super(config.scene, config.x, config.y, 'enemy');
		config.scene.add.existing(this);

		this.setDepth(200);
		this.target = target;

		this.scene.physics.add.overlap(
			this.target,
			this,
			() => {
				this.target.handleHit(100);
			},
			undefined,
			this,
		);
	}

	update() {
		let targetPos = new Phaser.Math.Vector2(this.target.getCenter());
		targetPos = targetPos.subtract(this.getCenter()).normalize();

		const speed = 100;
		this.setVelocityX(targetPos.x * speed);
		this.setVelocityY(targetPos.y * speed);
	}

	getScoreValue(): number {
		return 10;
	}
}
