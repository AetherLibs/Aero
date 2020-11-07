const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(guild, user) {
		if (guild.modCache.has(user.id)) return guild.modCache.delete(user.id);
		const ban = await guild
			.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' })
			.then(res => res.entries
				.filter(entry => entry.target.id === user.id)
				.last()
			);
		return guild.log.unban({ user, reason: ban.reason });
	}

};
