const { Event } = require('klasa');
const { encode } = require('../../lib/ws/util/MessageUtil');
const Message = require('../../lib/ws/Message');
const { READY_CLIENT } = require('../../lib/ws/util/constants').types;

module.exports = class extends Event {

	async run() {
		await this.client.chatwatch.login();
		this.client.console.log('[ChatWatch] Connected to Websocket.');
		if (process.env.BOOT_SINGLE !== 'false') return;
		this.client.console.log('[Aether] Sending ready event.');
		this.client.manager.ws.send(encode(new Message(READY_CLIENT, { id: this.client.manager.id })));
		this.client.events.get('debug').unload();
	}

};
