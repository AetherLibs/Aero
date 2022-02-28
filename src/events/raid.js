const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(guild, members) {
		for (const member of members)
			guild.raiderCache.add(member);

		if (!guild.settings.get('raid.channel')) return false;
		return guild.raidConfirmation
			? guild.updateRaidMessage()
			: guild.createRaidMessage();
	}

};
