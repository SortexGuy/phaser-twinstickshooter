import { Schema, MapSchema, type } from '@colyseus/schema';

// export class MyRoomState extends Schema {
// 	@type('string') mySynchronizedProperty: string = 'Hello world';
// }

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
	@type('number') x: number = 0.0;
	@type('number') y: number = 0.0;
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class ArenaState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
}
