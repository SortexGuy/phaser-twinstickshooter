import { Schema, MapSchema, type } from '@colyseus/schema';
import { IArenaState, IPlayer } from '../../../../client/src/types/IArenaState'

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema implements IPlayer {
	@type('number') x: number = 0.0;
	@type('number') y: number = 0.0;
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class ArenaState extends Schema implements IArenaState {
	@type({ map: Player }) players = new MapSchema<Player>();
}
