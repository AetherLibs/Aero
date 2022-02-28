const { Monitor } = require('@aero/klasa');
const req = require('@aero/http');
const PK_BASE = 'https://api.pluralkit.me/v2/';

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: false,
			ignoreEdits: false,
			ignoreWebhooks: false,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.webhookID) return;

		const res = await req(PK_BASE)
			.path('/messages', msg.id)
			.json()
			.catch(() => ({}));

		if (!res.sender) return;

		/* eslint-disable require-atomic-updates */
		msg.originalAuthor = msg.author;
		msg.webhookID = null;
		msg.author = await this.client.users.fetch(res.sender);
		/* eslint-enable require-atomic-updates */
	}

};
