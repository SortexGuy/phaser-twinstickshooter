import { GroupConfig, SpriteConfig } from '../scenes/Game';
import { Player } from './Player';

export class ProyectileManager extends Phaser.Physics.Arcade.Group {
	constructor(config: GroupConfig) {
		super(config.world, config.scene);
	}

	addProyectile(pos: Phaser.Math.Vector2, vel: Phaser.Math.Vector2, owner: Player) {
		const dir = vel.clone().normalize().scale(24);
		const config = { scene: this.scene, x: pos.x + dir.x, y: pos.y + dir.y };
		const proy = new Proyectile(config, owner);
		super.add(proy);
		proy.setDepth(50)
			.setCircle(8)
			.setVelocity(vel.x, vel.y)
			.setAngle(Phaser.Math.RadToDeg(vel.angle()) + 90);
	}

	preUpdate(time: number, delta: number): void {
		super.preUpdate(time, delta);
		this.children.each((v) => {
			v.update();
			return null;
		});
	}
}

export class Proyectile extends Phaser.Physics.Arcade.Image {
	private owner: Player;

	constructor(config: SpriteConfig, owner: Player) {
		super(config.scene, config.x, config.y, 'bullet');
		config.scene.add.existing(this);

		this.owner = owner;
		this.scene.time.addEvent({
			delay: 2000,
			repeat: 0,
			callback: () => {
				this.destroy(true);
			},
			callbackScope: this,
		});
	}

	update() {}

	addScoreToOwner(score: number) {
		this.owner.addToScore(score);
	}
}
