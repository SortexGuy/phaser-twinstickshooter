import { Scene } from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import eventsCenter from '../components/EventsCenter';

export class GameHUD extends Scene {
	private camera: Phaser.Cameras.Scene2D.Camera;
	private cursor: Phaser.GameObjects.Image;
	scoreLabel: RexUIPlugin.TagText;

	constructor() {
		super('GameHUD');
	}

	create() {
		this.camera = this.cameras.main.setZoom(2.4);
		const realCamPos = new Phaser.Math.Vector2(
			(this.camera.width - this.camera.displayWidth) / 2,
			(this.camera.height - this.camera.displayHeight) / 2,
		);
		this.scoreLabel = this.rexUI.add.tagText(
			0 + realCamPos.x,
			0 + realCamPos.y,
			'Score: 0',
			{
				stroke: 3,
				fontSize: 32,
				fontFamily: 'JetBrainsMono Nerd Font',
			},
		);
		this.scoreLabel.setDepth(20).setAlpha(0.6);

		// this.events.on(
		// 	'player-score-changed',
		// 	(score: number) => this.updateScoreLabel(score),
		// 	this,
		// );

		eventsCenter.on('player-score-changed', (score: number) => {
			console.log('Score changed: ' + score);
		});

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

	updateScoreLabel(score: number) {
		this.scoreLabel.setText('Score: ' + score);
	}
}
