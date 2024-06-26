import { Scene } from 'phaser';
import { Player } from '../components/Player';
import { Proyectile, ProyectileManager } from '../components/ProyectileManager';
import { Enemy, EnemySpawner } from '../components/EnemySpawner';
// import * as Colyseus from 'colyseus.js';
import type Server from '../services/Server';
import { IArenaState } from '../types/IArenaState';

export interface SpriteConfig {
	scene: Phaser.Scene;
	x: number;
	y: number;
}
export interface GroupConfig {
	world: Phaser.Physics.Arcade.World;
	scene: Phaser.Scene;
}

export class Game extends Scene {
	private camera: Phaser.Cameras.Scene2D.Camera;
	private msg_text: Phaser.GameObjects.Text;
	private enemy_spawner: EnemySpawner;
	private player: Player;
	private tilemap: Phaser.Tilemaps.Tilemap;

	constructor() {
		super('Game');
	}

	init() {
		// this.client = new Colyseus.Client('ws://localhost:45800');
	}

	create(data: { server: Server }) {
		const { server } = data;
		let colyseusStuff = async () => {
			await server.join();

			server.onStateChanged(this.onStateChanged, this);
		}
		colyseusStuff();

		this.camera = this.cameras.main;
		this.camera.setBackgroundColor(0xff0000).setZoom(2.4);

		const proy_man = new ProyectileManager({
			world: this.physics.world,
			scene: this,
		});
		this.add.existing(proy_man);

		this.player = new Player({ scene: this, x: 100, y: 100 }, proy_man);

		this.tilemap = this.make.tilemap({ key: 'main_arena' });
		const tileset = this.tilemap.addTilesetImage('tileset', 'arena_tiles');
		if (tileset === null) throw new Error('Tileset not found');

		const bLayer = this.tilemap.createLayer('Base', tileset, 0, 0)!.setDepth(-10);
		const sLayer = this.tilemap.createLayer('Solid', tileset, 0, 0)!.setDepth(0);
		sLayer.setCollisionByProperty({ collides: true });

		const spawn_points = this.tilemap.createFromObjects('SpawnPoints', {
			classType: Phaser.GameObjects.Sprite,
			key: 'spawnp',
		}) as Phaser.GameObjects.Sprite[];
		const spawn_timer = this.time.addEvent({
			delay: 3000,
			loop: true,
		});
		this.enemy_spawner = new EnemySpawner(
			{ world: this.physics.world, scene: this },
			spawn_points,
			spawn_timer,
			this.player,
		);
		this.add.existing(this.enemy_spawner);

		this.physics.add.collider(this.player, sLayer);
		this.physics.add.overlap(proy_man, this.enemy_spawner, (bullet, enemy) => {
			if (!(bullet instanceof Proyectile) || !(enemy instanceof Enemy))
				throw new Error('Wrong types for overlap');

			bullet.addScoreToOwner(enemy.getScoreValue());
			proy_man.remove(bullet, true, true);
			this.enemy_spawner.remove(enemy, true, true);
		});

		const debugGraphics = this.add.graphics().setAlpha(0.5).setDepth(1);
		sLayer.renderDebug(debugGraphics, {
			tileColor: null, // Color of non-colliding tiles
			collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
		});

		this.msg_text = this.add.text(
			512,
			384,
			'Make something fun!\nand share it with us:\nsupport@phaser.io',
			{
				fontFamily: 'Arial Black',
				fontSize: 38,
				color: '#ffffff',
				stroke: '#000000',
				strokeThickness: 8,
				align: 'center',
			},
		);
		this.msg_text.setOrigin(0.5);

		this.input.keyboard?.once('keydown-SPACE', () => {
			console.log('Cambiando a GameOver');
			this.scene.stop('GameHUD');
			this.scene.start('GameOver');
			this.scene.stop('PreGame');
			let leave = async () => {
				await server.leave();
			};
			leave();
		});

		this.scene.launch('GameHUD');
	}

	update(_time: number, _delta: number): void {
		this.input.mousePointer.updateWorldPoint(this.camera);
		this.player.update();
	}

	onStateChanged(state: IArenaState) {
		console.log(state);
	}
}
