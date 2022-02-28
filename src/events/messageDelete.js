const { Event } = require('@aero/klasa');
const req = require('@aero/http');
const PK_BASE = 'https://api.pluralkit.me/v2/';
const PK_ID = '466378653216014359';

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});

		this.gCache = new Map();
	}

	async run(msg) {
		if (msg.partial || !msg.guild || !msg?.guild?.log || !msg?.guild?.available || msg.author.bot) return false;

		let hasPk;

		if (this.gCache.has(msg.guild.id)) hasPk = this.gCache.get(msg.guild.id);

		if (hasPk) {
			const res = await req(PK_BASE)
				.path('/messages', msg.id)
				.json()
				.catch(() => ({}));

			if (res.sender) return false;
		}
		else {
			hasPk = await msg.guild.members.fetch(PK_ID).catch(() => false) && true;
			this.gCache.set(msg.guild.id, hasPk);
		}

		if (msg.invite)
			return msg.guild.log.inviteDeleted({ user: msg.author, message: msg, channel: msg.channel, invite: msg.invite === 'invalid' ? null : msg.invite });
		else
			return msg.guild.log.messageDeleted({ user: msg.author, message: msg, channel: msg.channel });
	}

};
