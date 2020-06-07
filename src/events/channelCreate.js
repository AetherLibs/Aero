const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(channel) {
		if (channel.partial || !channel.guild || !(channel.type === 'text')) return;
		const id = channel.guild.settings.get('mod.roles.mute');
		channel.initMute(id);
	}

};
