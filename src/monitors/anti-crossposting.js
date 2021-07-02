const { Monitor } = require('@aero/klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.crossposting') || msg.exempt) return;

		if (msg.content === msg.member.lastMessageContent && msg.channel.id !== msg.member.lastChannelID) {
			const crossposted = await msg.guild.channels.cache.get(msg.member.lastChannelID).messages.fetch(msg.member.lastMessageID);
			if (crossposted.deletable) crossposted.delete();
		}

		msg.member.lastChannelID = msg.channel.id;
		msg.member.lastMessageID = msg.id;
	}

};
