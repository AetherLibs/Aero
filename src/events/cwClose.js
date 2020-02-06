const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false,
			emitter: 'chatwatch',
			name: 'close'
		});
	}

	async run(code, reason) {
		this.client.console.error(`[ChatWatch] Closed (${code}): ${reason}`);
	}

};
