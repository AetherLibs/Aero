const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(member, bans) {
		member.guild.modCache.add(member.id);
		await member.guild.members.ban(member.id, { reason: member.guild.language.get('EVENT_GLOBALBAN_REASON') });
		const moderators = bans.map(ban => ban.moderator);
		const reason = bans.map(ban => `[${ban.provider}] ${ban.reason}`).join(', ');
		await member.guild.log.globalBan({ user: member.user, moderators, reason });
		if (member.guild.modCache.has(member.id)) member.guild.modCache.delete(member.id);
		return member;
	}

};
