import { Room, Client } from '@colyseus/core';
import { Player, ArenaState } from './schema/ArenaState';

export class Arena extends Room<ArenaState> {
	maxClients = 4;

	onCreate(options: any) {
		this.setState(new ArenaState());

		this.onMessage('type', (client, message) => {
			//
			// handle "type" message
			//
		});
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, 'joined!');
		this.state.players.set(client.sessionId, new Player());
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.sessionId, 'left!');
		this.state.players.delete(client.sessionId);
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
	}
}
