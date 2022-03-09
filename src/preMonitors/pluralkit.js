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
	}

	async run(msg) {
		if (!msg.pk || !msg.webhookID || !msg.guild) return;

		let senderId;

		if (this.cache.has(msg.author.id)) senderId = this.cache.get(msg.author.id);
		else {
			const res = await req(PK_BASE)
				.path('/messages', msg.id)
				.json()
				.catch(() => ({}));

			this.cache.set(msg.author.id, res.sender);

			if (!res.sender) {
				this.client.console.log(`[PluralKit] not converting ${msg.author.id} [${msg.guild.id}]: ${res.message}`);
				return;
			}

			/* eslint-disable-next-line prefer-destructuring */
			senderId = res.sender;
		}

		this.client.console.log(`[PluralKit] converting ${msg.author.id} --> ${senderId}`);

		/* eslint-disable require-atomic-updates */
		msg.originalAuthor = msg.author;
		msg.webhookID = null;
		msg.author = await this.client.users.fetch(senderId);
		/* eslint-enable require-atomic-updates */

		return;
	}

};
