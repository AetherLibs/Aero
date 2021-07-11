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
		if (!msg.guild || !msg.guild.settings.get('mod.anti.massmentions') || msg.exempt) return;

		const threshold = msg.guild.settings.get('mod.mentionThreshold');

		if (msg.mentions.users >= threshold)
			msg.guild.members.ban(msg.author.id, { reason: msg.language.get('MONITOR_ANTI_MASSMENTIONS', threshold), days: 1 });
	}

};
