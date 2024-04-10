import { Client } from 'colyseus.js';

export default class Server {
	private client: Client;

	constructor() {
		this.client = new Client('ws://localhost:45800');
	}
}
