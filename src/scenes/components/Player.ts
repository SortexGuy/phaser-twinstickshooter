import { ProyectileManager } from './ProyectileManager';

type PlayerInput = {
	up: Phaser.Input.Keyboard.Key;
	down: Phaser.Input.Keyboard.Key;
	left: Phaser.Input.Keyboard.Key;
	right: Phaser.Input.Keyboard.Key;
	// shoot: Phaser.Input.Keyboard.Key;
	// shift: Phaser.Input.Keyboard.Key;
};

export class Player {
	sprite: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	private camera: Phaser.Cameras.Scene2D.Camera;
	private inputs: PlayerInput;
	private proy_man: ProyectileManager;
	private clock: Phaser.Time.Clock;
	private scene_man: Phaser.Scenes.ScenePlugin;
	private lastTime: number = 0;
	private shootTimer: number = 500;
	private health: number = 500;

	constructor(
		sprite: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
		camera: Phaser.Cameras.Scene2D.Camera,
		proy_man: ProyectileManager,
		scene_man: Phaser.Scenes.ScenePlugin,
	) {
		this.proy_man = proy_man;
		this.sprite = sprite;
		this.sprite.setCircle(7, 2, 2).setActive(true);

		this.camera = camera;
		this.camera.startFollow(this.sprite);

		this.scene_man = scene_man;

		this.clock = this.camera.scene.time;
		this.lastTime = this.clock.now;

		this.inputs = this.camera.scene.input.keyboard?.addKeys({
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
		this.sprite.setVelocity(dir.x * speed, dir.y * speed);

		let mousePointer = this.camera.scene.input.mousePointer;
		let dirToMouse = new Phaser.Math.Vector2(
			mousePointer.worldX,
			mousePointer.worldY,
		).subtract({ x: this.sprite.x, y: this.sprite.y });

		// Shooting logic
		dirToMouse = dirToMouse.normalize();
		this.shootTimer -= this.clock.now - this.lastTime;
		if (mousePointer.leftButtonDown() && this.shootTimer < 0) {
			this.shootTimer = 200;
			this.proy_man.add(this.sprite.getCenter(), dirToMouse.scale(300), this);
		}

		this.lastTime = this.clock.now;
	}

	handleHit(dmg: number) {
		this.health -= dmg;
		if (this.health <= 0) {
			this.scene_man.start('GameOver');
		}
	}
}
