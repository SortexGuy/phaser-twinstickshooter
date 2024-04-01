import { Player } from './Player';

export class ProyectileManager {
	private time: Phaser.Time.Clock;
	private physics: Phaser.Physics.Arcade.ArcadePhysics;
	private pool: Proyectile[] = [];

	constructor(physics: Phaser.Physics.Arcade.ArcadePhysics, time: Phaser.Time.Clock) {
		this.physics = physics;
		this.time = time;
	}

	add(pos: Phaser.Math.Vector2, velocity: Phaser.Math.Vector2, owner: Player) {
		const dir = velocity.clone().normalize().scale(24);
		this.pool.push(
			new Proyectile(
				this.physics.add
					.image(pos.x + dir.x, pos.y + dir.y, 'bullet')
					.setDepth(50)
					.setVelocity(velocity.x, velocity.y)
					.setAngle(Phaser.Math.RadToDeg(velocity.angle()) + 90),
				this.time,
				this,
				owner,
			),
		);
	}

	destroy(proy: Proyectile) {
		let idx = this.pool.indexOf(proy);
		this.pool = this.pool.splice(idx);
	}

	update() {
		this.pool.forEach((v, _i, _arr) => {
			v.update();
		});
	}
}

class Proyectile {
	private manager: ProyectileManager;
	owner: Player;
	clock: Phaser.Time.TimerEvent;
	body: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

	constructor(
		body: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
		time: Phaser.Time.Clock,
		manager: ProyectileManager,
		owner: Player,
	) {
		this.body = body;
		this.owner = owner;
		this.manager = manager;
		this.clock = time.addEvent({
			delay: 2000,
			repeat: 0,
			callback: this.destroy,
			callbackScope: this,
		});
		// this.body.setCollisionCategory(2).addCollidesWith(0);
	}

	update() {
		// if (this.body.willCollideWith(0)) this.destroy();
	}

	destroy() {
		this.manager.destroy(this);
		this.body.destroy(true);
	}
}
