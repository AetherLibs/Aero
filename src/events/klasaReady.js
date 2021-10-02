const { Event } = require('@aero/klasa');
const { encode } = require('../../lib/ws/util/MessageUtil');
const Message = require('../../lib/ws/Message');
const { READY_CLIENT } = require('../../lib/ws/util/constants').types;
const req = require('@aero/centra');

function updateWsPing(client) {
	const epochInSeconds = Math.floor(new Date() / 1000);
	const data = {
		timestamp: epochInSeconds,
		value: client.ws.ping
	};

	req('https://api.statuspage.io/v1/pages')
		.path(process.env.STATUS_ID)
		.path('/metrics')
		.path(process.env.STATUS_METRIC_WSPING)
		.path('data.json')
		.method('POST')
		.header('Authorization', `OAuth ${process.env.STATUS_TOKEN}`)
		.body({data}, 'json')
		.send();
}

module.exports = class extends Event {

	async run() {
		if (this.client.config.cwEnabled) {
			await this.client.chatwatch.login()
				.then(() => this.client.console.log('[ChatWatch] Connected to Websocket.'))
				.catch(err => this.client.console.error('[ChatWatch] failed to log in', err));
		}
		this.client.user.setActivity(`${this.client.options.prefix}help`, { type: 'LISTENING' });
		if (process.env.BOOT_SINGLE === 'false') {
			this.client.console.log('[Aether] Sending ready event.');
			this.client.manager.ws.send(encode(new Message(READY_CLIENT, { id: this.client.manager.id })));
		}
		if (this.client.config.stage === 'staging') {
			this.client.setInterval(() => updateWsPing(this.client), 60 * 1000);
		}
	}

};
