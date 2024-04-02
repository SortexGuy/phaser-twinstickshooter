import { Scene } from 'phaser';
// import { Player } from './components/Player';
// import { ProyectileManager } from './components/ProyectileManager';
// import { EnemySpawner } from './components/EnemySpawner';

import { createWorld, addEntity, addComponent, System, IWorld } from 'bitecs';

import { Player, ArcadeSprite, Position, Velocity } from '../components';
import { createArcadeSpriteSystem } from '../systems/ArcadeSpriteSystem';
import { createMovementSystem } from '../systems/MovementSystem';
import { PlayerInput, createPlayerInputSystem } from '../systems/PlayerInputSystem';

const TextureKeys = ['player', 'bullet', 'enemy'];
enum TexturesIDs {
	Player,
	Bullet,
	Enemy,
}

export class Game extends Scene {
	private world: IWorld;
	private camera: Phaser.Cameras.Scene2D.Camera;
	private msg_text: Phaser.GameObjects.Text;
	private tilemap: Phaser.Tilemaps.Tilemap;
	// private player: Player;
	// private proyectile_man: ProyectileManager;
	// private enemy_spawner: EnemySpawner;
	private phyGroup: Phaser.Physics.Arcade.Group;

	private systems: System[] = [];

	constructor() {
		super('Game');
	}

	create() {
		this.camera = this.cameras.main;
		this.camera.setBackgroundColor(0xff0000);
		// .setZoom(2.4);

		// Ecs stuff
		this.world = createWorld();
		const player = addEntity(this.world);

		addComponent(this.world, Position, player);
		addComponent(this.world, Velocity, player);
		addComponent(this.world, ArcadeSprite, player);
		addComponent(this.world, Player, player);

		Position.x[player] = 80;
		Position.y[player] = 80;
		Velocity.x[player] = 0;
		Velocity.y[player] = 0;
		ArcadeSprite.texture[player] = TexturesIDs.Player;

		this.phyGroup = this.physics.add.group();
		const inputs = this.camera.scene.input.keyboard?.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		}) as PlayerInput;

		this.systems = [];
		this.systems.push(createPlayerInputSystem(inputs));
		// this.systems.push(createMovementSystem(this));
		this.systems.push(
			createArcadeSpriteSystem(this.phyGroup, TextureKeys, this.camera),
		);

		// this.proyectile_man = new ProyectileManager(this.physics, this.time);
		// this.player = new Player(
		// 	this.physics.add.image(100, 100, 'player').setDepth(500),
		// 	this.camera,
		// 	this.proyectile_man,
		// 	this.scene,
		// );

		this.tilemap = this.make.tilemap({ key: 'main_arena' });
		const tileset = this.tilemap.addTilesetImage('tileset', 'arena_tiles');
		const bLayer = this.tilemap.createLayer('Base', tileset, 0, 0).setDepth(-10);
		const sLayer = this.tilemap.createLayer('Solid', tileset, 0, 0).setDepth(0);
		sLayer.setCollisionByProperty({ collides: true });

		// const spawn_points = this.tilemap.createFromObjects('SpawnPoints', {
		// 	classType: Phaser.GameObjects.Sprite,
		// 	key: 'spawnp',
		// }) as Phaser.GameObjects.Sprite[];
		// const spawn_timer = this.time.addEvent({
		// 	delay: 3000,
		// 	loop: true,
		// });
		// this.enemy_spawner = new EnemySpawner(
		// 	spawn_points,
		// 	spawn_timer,
		// 	this.player,
		// 	this.physics,
		// 	this.scene,
		// );
		//
		// this.physics.add.collider(this.player.sprite, sLayer);
		//
		// const debugGraphics = this.add.graphics().setAlpha(0.5).setDepth(1);
		// sLayer?.renderDebug(debugGraphics, {
		// 	tileColor: null, // Color of non-colliding tiles
		// 	collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255), // Color of colliding tiles
		// 	faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
		// });

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
		});

		this.scene.launch('GameHUD');
	}

	update(_t: number, _dt: number): void {
		// this.input.mousePointer.updateWorldPoint(this.camera);
		//
		// this.enemy_spawner.update();
		// this.player.update();

		if (!this.world || this.systems.length <= 0) return;
		this.systems.forEach((sys) => sys?.(this.world));
	}
}
