const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	async run(oldMember, newMember) {
		if (oldMember.displayName === newMember.displayName) return;
		if (newMember.guild.modCache.has(newMember.id)) return;
		this.cleanName(newMember);
		this.dehoist(newMember);
	}

	dehoist(member) {
		if (!member.guild.settings.get('mod.anti.hoisting')) return;
		if (member.displayName[0] < '0') member.dehoist();
	}

	cleanName(member) {
		if (!member.guild.settings.get('mod.anti.unmentionable')) return;
		member.cleanName();
	}

};
