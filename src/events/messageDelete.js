const { Event } = require('@aero/klasa');
const req = require('@aero/http');
const PK_BASE = 'https://api.pluralkit.me/v2/';

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(msg) {
		if (msg.partial || !msg.guild || !msg?.guild?.log || !msg?.guild?.available || msg.author.bot) return false;

		const res = await req(PK_BASE)
			.path('/messages', msg.id)
			.json()
			.catch(() => ({}));

		if (res.sender) return false;

		if (msg.invite)
			return msg.guild.log.inviteDeleted({ user: msg.author, message: msg, channel: msg.channel, invite: msg.invite === 'invalid' ? null : msg.invite });
		else
			return msg.guild.log.messageDeleted({ user: msg.author, message: msg, channel: msg.channel });
	}

};
