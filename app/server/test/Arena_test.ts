import assert from 'assert';
import { ColyseusTestServer, boot } from '@colyseus/testing';

// import your "app.config.ts" file here.
import appConfig from '../src/app.config';
import { Player, ArenaState } from '../src/rooms/schema/ArenaState';

describe('testing your Colyseus app', () => {
	let colyseus: ColyseusTestServer;

	before(async () => (colyseus = await boot(appConfig)));
	after(async () => colyseus.shutdown());

	beforeEach(async () => await colyseus.cleanup());

	it('connecting into a room', async () => {
		// `room` is the server-side Room instance reference.
		const room = await colyseus.createRoom<ArenaState>('room_arena', {});

		// `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
		const client1 = await colyseus.connectTo(room);
		const c1sID = client1.sessionId;

		// make your assertions
		assert.strictEqual(c1sID, room.clients[0].sessionId);

		// wait for state sync
		await room.waitForNextPatch();

		let players = {};
		players[c1sID] = { x: 0.0, y: 0.0 };
		assert.deepStrictEqual({ players: players }, client1.state.toJSON());
	});
});
