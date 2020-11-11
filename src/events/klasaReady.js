const { Event } = require('@aero/klasa');
const { encode } = require('../../lib/ws/util/MessageUtil');
const Message = require('../../lib/ws/Message');
const { READY_CLIENT } = require('../../lib/ws/util/constants').types;

module.exports = class extends Event {

	async run() {
		if (this.client.config.cwEnabled) {
			await this.client.chatwatch.login()
				.then(() => this.client.console.log('[ChatWatch] Connected to Websocket.'))
				.catch(err => this.client.console.error('[ChatWatch] failed to log in', err));
		}
		if (process.env.BOOT_SINGLE !== 'false') return;
		this.client.console.log('[Aether] Sending ready event.');
		this.client.manager.ws.send(encode(new Message(READY_CLIENT, { id: this.client.manager.id })));
	}

};
