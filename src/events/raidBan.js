const { Event } = require('@aero/klasa');
const { noop } = require('../../lib/util/constants');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(message, moderator) {
		message.edit(message.language.get('EVENT_RAID_PREVENTED'), message.guild.constructMessage());
		for (const raider of message.guild.raiderCache.values()) {
			message.guild.modCache.add(raider);
			message.guild.members.ban(raider, { days: 1, reason: message.language.get('EVENT_RAID_BANREASON') }).catch(noop);
		}
		message.guild.log.bulkBan({ users: [...message.guild.raiderCache.values()], moderator, reason: 'Automatic raid prevention' });
		message.guild.raidReset();
	}

};
