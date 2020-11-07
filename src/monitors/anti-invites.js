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

		this.inviteRegex = /(https?:\/\/)?(.*?@)?(www\.)?((discord|invite)\.(gg|li|me|io)|discord(app)?\.com\/invite)\/(\s)?.+/ui;
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.invites') || msg.exempt) return;
		if (this.inviteRegex.test(msg.content)) msg.delete();
	}

};
