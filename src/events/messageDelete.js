const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(msg) {
		if (msg.partial || !msg.guild || !msg?.guild?.log || !msg?.guild?.available || msg.author.bot) return false;
		return msg.guild.log.messageDeleted({ user: msg.author, message: msg, channel: msg.channel });
	}

};
