const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(oldMessage, newMessage) {
		if (!oldMessage.guild || oldMessage.author.bot) return false;
		if ((oldMessage.content === newMessage.content) && (oldMessage.attachments.size === newMessage.attachments.size)) return false;
		return newMessage.guild.log.messageEdited({ oldMessage, newMessage, user: oldMessage.author, channel: oldMessage.channel });
	}

};
