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
		if (msg.content === msg.member.lastMessageContent) {
			msg.delete();
			if (msg.member.duplicateCount > 4) {
				msg.member.mute('Possible raid.');
				this.client.emit('raid', msg.guild, [msg.member.id]);
			}
			msg.member.duplicateCount++;
		} else {
			msg.member.lastMessageContent = msg.content;
		}
	}

};
