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

		this.cache = new Map();
	}

	async run(msg) {
		if (!msg.webhookID) return;

		if (!this.cache.has(msg.author.id)) {
			const res = await req(PK_BASE)
				.path('/messages', msg.id)
				.json()
				.catch(() => ({}));

			this.client.console.log(`[PluralKit] not converting ${msg.author.id} [${msg.guild.id}]: ${res.message}`);

			if (!res.sender) return;

			this.cache.set(msg.author.id, res.sender);
		}

		const sender = this.cache.get(msg.author.id);

		this.client.console.log(`[PluralKit] converting ${msg.author.id} --> ${sender}`);

		/* eslint-disable require-atomic-updates */
		msg.originalAuthor = msg.author;
		msg.webhookID = null;
		msg.author = await this.client.users.fetch(sender);
		/* eslint-enable require-atomic-updates */

		return;
	}

};
