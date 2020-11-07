const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(member) {
		member.guild.modCache.add(member.id);
		await member.guild.members.ban(member.id, { reason: member.guild.language.get('EVENT_GLOBALBAN_REASON') });
		const ban = await this.client.ksoft.bans.info(member.id);
		await member.guild.log.globalBan({ user: member.user, moderator: ban.moderator, reason: ban.reason });
		if (member.guild.modCache.has(member.id)) member.guild.modCache.delete(member.id);
		return member;
	}

};
