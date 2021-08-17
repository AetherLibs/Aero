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

		if (msg.content === msg.member.prevMessageContent && msg.channel.id !== msg.member.prevChannelID) {
			const crossposted = await msg.guild.channels.cache.get(msg.member.prevChannelID).messages.fetch(msg.member.prevMessageID).catch(() => ({ deletable: false }));
			if (crossposted.deletable) crossposted.delete();
		}
	}

};
