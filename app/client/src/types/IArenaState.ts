export interface IPlayer {
	x: number;
	y: number;
}

export interface IArenaState {
	players: Map<string, IPlayer>;
}
