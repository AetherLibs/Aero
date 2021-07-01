const { Monitor } = require('@aero/klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.scams') || msg.exempt) return;
		
		const cleanedContent = require('@aero/sanitizer')(msg.content).toLowerCase();
		const alphanumContent = cleanedContent.replace(/[\W]+/g, '');

		let fraudFlags = 0;

		if (alphanumContent.includes('csgo') || alphanumContent.includes('trade') || alphanumContent.includes('knife') || msg.mentions.everyone) fraudFlags++;

		if (/https?:\/\/st(ea|ae)(m|n|rn)/.test(msg.content)) fraudFlags += 2;

		if (/https?:\/\//.test(msg.content) && /\w+\.ru/.test(msg.content)) fraudFlags++;

		if (fraudFlags > 1) {
			msg.guild.members.ban(msg.author.id, { reason: msg.language.get('MONITOR_ANTI_SCAMS', fraudFlags * 50, msg.content), days: 1 });
			return true;
		} else {
			return false;
		}
	}

};
