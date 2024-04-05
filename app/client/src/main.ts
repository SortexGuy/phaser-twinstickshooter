import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameHUD } from './scenes/GameHUD';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game as PGame, Types } from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 960,
	height: 540,
	parent: 'game-container',
	backgroundColor: '#028af8',
	pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { x: 0, y: 0 },
		},
	},
	scene: [Boot, Preloader, MainMenu, Game, GameHUD, GameOver],
	plugins: {
		scene: [
			{
				key: 'rexUI',
				plugin: RexUIPlugin,
				mapping: 'rexUI',
			},
		],
	},
};

export default new PGame(config);
