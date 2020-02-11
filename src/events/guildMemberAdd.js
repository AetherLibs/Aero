const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(member) {
		await member.settings.sync();

		// autoroles
		const autoroles = await member.guild.settings.get('mod.roles.auto');
		if (member.user.bot) {
			const botrole = await member.guild.settings.get('mod.roles.bots');
			if (botrole) member.roles.add(botrole, member.guild.language.get('EVENT_BOTROLE_REASON')).catch(() => null);
		} else if (autoroles.length) await member.roles.add(autoroles, member.guild.language.get('EVENT_AUTOROLE_REASON')).catch(() => null);

		// persistency
		const persistroles = member.settings.get('persistRoles').filter(id => !autoroles.includes(id));
		if (persistroles.length) await member.roles.add(persistroles, member.guild.language.get('EVENT_JOIN_PERSISTREASON')).catch(() => null);
		const persistnick = member.settings.get('persistNick');
		if (persistnick) await member.setNickname(persistnick);

		// raid prevention
		member.guild.joinCache.add(member.id);
		setTimeout(() => { member.guild.joinCache.delete(member.id); }, 20000);
		if (member.guild.joinCache.size >= 50) this.client.emit('raid', member.guild, [...member.guild.joinCache]);

		// username cleanup
		member.guild.modCache.add(member.id);
		await this.dehoist(member);
		await this.cleanName(member);
		member.guild.modCache.delete(member.id);

		// logging
		await member.guild.log.memberJoined({ member });

		// global ban check
		const globalBanned = await this.client.ksoft.bans.check(member.id);
		if (globalBanned) this.client.emit('globalBan', member);

		return member;
	}

	dehoist(member) {
		if (!member.guild.settings.get('mod.anti.hoisting')) return member;
		if (member.displayName[0] < '0') member.dehoist();
		return member;
	}

	cleanName(member) {
		if (!member.guild.settings.get('mod.anti.unmentionable')) return member;
		member.cleanName();
		return member;
	}

};
