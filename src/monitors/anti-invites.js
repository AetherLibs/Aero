const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});

		this.inviteRegex = /(https?:\/\/)?(www\.)?((discord|invite)\.(gg|li|me|io)|discordapp\.com\/invite)\/(\s)?.+/u;
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.invites') || msg.exempt) return;
		if (this.inviteRegex.test(msg.content)) msg.delete();
	}

};