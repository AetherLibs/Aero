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

		this.client.console.log(`[PluralKit] not converting ${msg.author.id} [${msg.guild.id}]: ${res.message}`);

		if (!res.sender) return;

		this.client.console.log(`[PluralKit] converting ${msg.author.id} --> ${res.sender}`);

		/* eslint-disable require-atomic-updates */
		msg.originalAuthor = msg.author;
		msg.webhookID = null;
		msg.author = await this.client.users.fetch(res.sender);
		/* eslint-enable require-atomic-updates */

		return;
	}

};
