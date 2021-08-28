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
		if (!msg.guild || !msg.guild.settings.get('mod.anti.duplicates') || msg.exempt) return;
		if (msg.content === msg.member.prevMessageContent) {
			msg.delete();
			if (msg.member.duplicateCount > 4) {
				msg.member.mute('Muted by anti-duplicates, "[p]anti duplicates disable" to turn off.');
				this.client.emit('raid', msg.guild, [msg.member.id]);
			}
			msg.member.duplicateCount++;
		}
	}

};
