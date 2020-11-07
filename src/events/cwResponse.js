const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false,
			emitter: 'chatwatch',
			name: 'response'
		});
	}

	async run(data) {
		const guild = this.client.guilds.cache.get(data.message.guild);
		if (!guild || !guild.settings.get('mod.anti.toxicity')) return;
		if (data.scores.overall > 85) {
			guild.channels
				.get(data.message.channel).messages
				.get(data.message.id)
				.delete()
				.catch(() => null);
		}
	}

};
