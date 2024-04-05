import { SpriteConfig } from '../scenes/Game';
import eventsCenter from './EventsCenter';
import { ProyectileManager } from './ProyectileManager';

type PlayerInput = {
	up: Phaser.Input.Keyboard.Key;
	down: Phaser.Input.Keyboard.Key;
	left: Phaser.Input.Keyboard.Key;
	right: Phaser.Input.Keyboard.Key;
	// shoot: Phaser.Input.Keyboard.Key;
	// shift: Phaser.Input.Keyboard.Key;
};

export class Player extends Phaser.Physics.Arcade.Image {
	private inputs: PlayerInput;
	private proy_man: ProyectileManager;
	private clock: Phaser.Time.Clock;
	private lastTime: number = 0;
	private shootTimer: number = 500;
	private health: number = 500;
	private score: number = 0;

	private invulTimer: number = 2000;
	private invul: boolean = false;

	constructor(config: SpriteConfig, proy_man: ProyectileManager) {
		const texture = config.scene.textures.get('player');
		super(config.scene, config.x, config.y, texture);
		config.scene.add.existing(this); // Add to display list
		config.scene.physics.add.existing(this); // Add to update list
		this.setCircle(7, 2, 2).setActive(true).setDepth(500);

		this.proy_man = proy_man;

		let cam = this.scene.cameras.main;
		cam.startFollow(this);

		this.clock = this.scene.time;
		this.lastTime = this.clock.now;

		this.inputs = this.scene.input.keyboard?.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		}) as PlayerInput;
	}

	update() {
		// Movement
		const dir: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
			(this.inputs.left.isDown ? -1 : 0) + (this.inputs.right.isDown ? 1 : 0),
			(this.inputs.up.isDown ? -1 : 0) + (this.inputs.down.isDown ? 1 : 0),
		).normalize();
		const speed = 140;
		this.setVelocity(dir.x * speed, dir.y * speed);

		let mousePointer = this.scene.input.mousePointer;
		let dirToMouse = new Phaser.Math.Vector2(
			mousePointer.worldX,
			mousePointer.worldY,
		).subtract({ x: this.x, y: this.y });

		// Shooting logic
		dirToMouse = dirToMouse.normalize();
		this.shootTimer -= this.clock.now - this.lastTime;
		if (mousePointer.leftButtonDown() && this.shootTimer < 0) {
			this.shootTimer = 200;
			this.proy_man.addProyectile(this.getCenter(), dirToMouse.scale(300), this);
		}

		this.lastTime = this.clock.now;
	}

	handleHit(dmg: number) {
		if (this.invul) return;

		this.health -= dmg;
		if (this.health <= 0) {
			this.scene.scene.start('GameOver');
		}

		this.invul = true;
		this.setAlpha(0.75);
		this.clock.addEvent({
			delay: this.invulTimer,
			loop: false,
			callback: () => {
				this.invul = false;
				this.setAlpha(1);
			},
		});
	}

	addToScore(score: number) {
		this.score += score;
		eventsCenter.emit('player-score-changed', this.score);
	}
}
