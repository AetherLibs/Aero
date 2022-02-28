const { Monitor } = require('@aero/klasa');
const req = require('@aero/http');
const PK_BASE = 'https://api.pluralkit.me/v2/';
const PK_ID = '466378653216014359';

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
		this.gCache = new Map();
	}

	async run(msg) {
		if (!msg.webhookID || !msg.guild) return;

		let hasPk;

		if (this.gCache.has(msg.guild.id)) hasPk = this.gCache.get(msg.guild.id);
		else {
			hasPk = await msg.guild.members.fetch(PK_ID).catch(() => false);
			this.gCache.set(msg.guild.id, hasPk);
		}

		let sender;

		if (this.cache.has(msg.author.id)) sender = this.cache.get(msg.author.id)
		else {
			if (sender === false) return;

			const res = await req(PK_BASE)
				.path('/messages', msg.id)
				.json()
				.catch(() => ({}));

			this.cache.set(msg.author.id, res.sender ?? false);

			if (!res.sender) {
				this.client.console.log(`[PluralKit] not converting ${msg.author.id} [${msg.guild.id}]: ${res.message}`);
				return;
			}
		}

		this.client.console.log(`[PluralKit] converting ${msg.author.id} --> ${sender}`);

		/* eslint-disable require-atomic-updates */
		msg.originalAuthor = msg.author;
		msg.webhookID = null;
		msg.author = await this.client.users.fetch(sender);
		/* eslint-enable require-atomic-updates */

		return;
	}

};
