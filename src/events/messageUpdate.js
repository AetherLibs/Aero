const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(oldMessage, newMessage) {
		if (oldMessage.partial || newMessage.partial || !newMessage?.guild?.available || !newMessage?.guild?.log || oldMessage.author.bot) return false;
		if ((oldMessage.content === newMessage.content) && (oldMessage.attachments.size === newMessage.attachments.size)) return false;
		return newMessage.guild.log.messageEdited({ oldMessage, newMessage, user: oldMessage.author, channel: oldMessage.channel });
	}

};
