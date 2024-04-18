import { Scene, GameObjects } from 'phaser';
import Server from '../services/Server';

export class PreGame extends Scene {
	private server: Server;

	constructor() {
		super('PreGame');
	}

	init() {
		this.server = new Server();
	}

	create() {
		console.log('PreGame enter with: ' + this.server);
		this.scene.launch('Game', {
			server: this.server,
		});
	}
}
