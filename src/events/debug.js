const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(info) {
		this.client.console.debug(`[Discord] ${info}`);
	}

};
