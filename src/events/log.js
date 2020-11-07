const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(text) {
		this.client.console.log(text.split('\n').map(line => `[Klasa] ${line}`).join('\n'));
	}

};
