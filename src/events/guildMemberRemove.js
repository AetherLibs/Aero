const { Event } = require('@aero/klasa');
const { deconstruct } = require('discord.js').SnowflakeUtil;

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(member) {
		await member.settings.sync();
		if (member.guild.settings.get('persist')) {
			member.settings.update('persistRoles', member.roles.cache
				.filter(role => !role.managed)
				.keyArray()
				.filter(roleID => roleID !== member.guild.id), { arrayAction: 'overwrite' });
			if (member.nickname) member.settings.update('persistNick', member.nickname);
		} else if (member.muted)
			member.settings.update('persistRoles', [member.guild.settings.get('mod.roles.mute')], { arrayAction: 'overwrite' });

		const { guild, user } = member;
		if (guild.modCache.has(member.id)) return guild.modCache.delete(member.id);
		const kick = await guild
			.fetchAuditLogs({ type: 'MEMBER_KICK' })
			.then(res => res.entries
				.filter(entry => entry.target.id === member.id)
				.sort((a, b) => parseInt(BigInt(a.id) - BigInt(b.id)))
				.last()
			).catch(() => null);
		if (!kick) return guild.log.memberLeft({ member });
		const now = new Date();
		const then = deconstruct(kick.id).date;
		const diff = Math.abs(now.getTime() - then.getTime());
		return kick && diff < 120 * 1000
			? guild.log.kick({ user, reason: kick.reason, moderator: kick.executor })
			: guild.log.memberLeft({ member });
	}

};
