const { Event } = require('klasa');
const { deconstruct } = require('discord.js').SnowflakeUtil;

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(member) {
		const { guild, user } = member;
		if (guild.modCache.has(member.id)) return guild.modCache.delete(member.id);
		const kick = await guild
			.fetchAuditLogs({ type: 'MEMBER_KICK' })
			.then(res => res.entries
				.filter(entry => entry.target.id === member.id)
				.sort((a, b) => parseInt(BigInt(a.id) - BigInt(b.id)))
				.last()
			);
		const now = new Date();
		const then = deconstruct(kick.id).date;
		const diff = Math.abs(now.getTime() - then.getTime());
		console.log({ now, then, diff });
		return (kick && diff < 120 * 1000) // checks if there was a kick in the last two minutes
			? guild.log.kick({ user, reason: kick.reason, moderator: kick.executor })
			: guild.log.memberLeft({ member });
	}

};