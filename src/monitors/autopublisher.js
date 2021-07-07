const { Monitor } = require('@aero/klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: false,
			ignoreSelf: false,
			ignoreEdits: false,
			ignoreOthers: false,
			ignoreWebhooks: false
		});
	}

	async run(msg) {
		if (!msg.guild || !(msg.channel?.type === 'news')) return false;

		const possibles = msg.guild.settings.get('autopublish');

		if (!possibles.includes(msg.channel.id)) return false;

		return msg.crosspost();
	}

};
