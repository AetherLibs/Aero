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
		if (msg.exempt) return;

		msg.member.prevMessageContent = msg.content;
		msg.member.prevChannelID = msg.channel.id;
		msg.member.prevMessageID = msg.id;
	}

};
