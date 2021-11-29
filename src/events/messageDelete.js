const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(msg) {
		if (msg.partial || !msg.guild || !msg?.guild?.log || !msg?.guild?.available || msg.author.bot) return false;
		if (msg.invite == 'invalid') {
			msg.guild.log.inviteDeleted({ user: msg.author, message: msg, channel: msg.channel });
		}
		else if (msg.invite) {
			return msg.guild.log.inviteDeleted({ user: msg.author, message: msg, channel: msg.channel, invite: msg.invite });
		}
		else {
			return msg.guild.log.messageDeleted({ user: msg.author, message: msg, channel: msg.channel });
		}
	}

};
