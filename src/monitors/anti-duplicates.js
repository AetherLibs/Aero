const { Monitor } = require('@aero/klasa');
const { JaroWinklerDistance: jaroWinklerDistance } = require('natural');

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

		if (!msg.member.prevMessageContent) return;

		const similarity = jaroWinklerDistance(msg.content, msg.member.prevMessageContent, undefined, true) * 100;

		if (similarity >= msg.guild.settings.get('mod.similarityThreshold')) {
			msg.delete();
			if (msg.member.duplicateCount > 4) {
				msg.member.mute('Muted by anti-duplicates, "[p]anti duplicates disable" to turn off.');
				this.client.emit('raid', msg.guild, [msg.member.id]);
			}
			msg.member.duplicateCount++;
		} else if (msg.member.duplicateCount > 0) {
			if (msg.member.nonduplicateCount < 50) msg.member.nonduplicateCount++;
			else msg.member.duplicateCount = 0;
		}
	}

};
