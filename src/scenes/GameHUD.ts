import { Scene } from 'phaser';

export class GameHUD extends Scene {
	private camera: Phaser.Cameras.Scene2D.Camera;
	private cursor: Phaser.GameObjects.Image;

	constructor() {
		super('GameHUD');
	}

	create() {
		this.camera = this.cameras.main.setZoom(2.4);
		this.cursor = this.add.image(0, 0, 'cursor').setScrollFactor(0).setDepth(10);
	}

	update(time: number, delta: number): void {
		const pointer = this.input.mousePointer.updateWorldPoint(this.camera);
		const camCenter: Phaser.Types.Math.Vector2Like = {
			x: this.camera.width / 2,
			y: this.camera.height / 2,
		};
		const mousePos = pointer.position
			.clone()
			.subtract(camCenter)
			.normalize()
			.scale(64)
			.add(camCenter);
		this.cursor.setPosition(mousePos.x, mousePos.y).setDepth(900);
	}
}
