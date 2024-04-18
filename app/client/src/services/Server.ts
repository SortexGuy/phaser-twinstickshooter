import { Client, Room } from 'colyseus.js';
import { IArenaState } from '../types/IArenaState';

export default class Server {
	private client: Client;
	private events: Phaser.Events.EventEmitter;
	private room: Room;

	constructor() {
		this.client = new Client('ws://localhost:4580');
		this.events = new Phaser.Events.EventEmitter();
	}

	async join() {
		const roomName = 'room_arena';
		const prom = this.client.joinOrCreate<IArenaState>(roomName);

		try {
			this.room = await prom;
			console.log('joined successfully', this.room.name);
		} catch (e) {
			console.error('join error', e);
		}
		this.room.onStateChange((state: IArenaState) => {
			this.events.emit('once-state-changed', state);
		});
	}

	async leave() {
		await this.room.leave();
	}

	onStateChanged(cb: (state: IArenaState) => void, context?: any) {
		this.events.once('once-state-changed', cb, context);
	}
}
