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

		this.knownBads = ['stencommunity.com', 'stearncomminuty.ru', 'streancommuntiy.com', 'stearncommunytu.ru', 'steamcommunyru.com'];
		this.steamBads = ['csgo', 'trade', 'knife', 'steam', 'skins'];
		this.nitroBads = ['nitro', 'generator'];
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.scams') || msg.exempt) return;
		
		const cleanedContent = require('@aero/sanitizer')(msg.content).toLowerCase();
		const alphanumContent = cleanedContent.replace(/[\W]+/g, '');

		if (this.hasKnownBad(msg)
			|| this.isSteamFraud(msg, cleanedContent, alphanumContent)
			|| this.isNitroFraud(msg, cleanedContent, alphanumContent)) {
			msg.guild.members.ban(msg.author.id, { reason: msg.language.get('MONITOR_ANTI_SCAMS', msg.content), days: 1 });
		}
	}

	isSteamFraud(msg, cleanedContent, alphanumContent) {
		let fraudFlags = 0;

		if (this.steamBads.reduce((acc, cur) => acc || alphanumContent.includes(cur), false)) fraudFlags++;

		if (/https?:\/\/str?(ea|ae)(m|n|rn)c/.test(msg.content) || /str?(ea|ae)(m|n|rn)comm?(unt?(i|y)t?(y|u))|(inuty)\.\w/.test(msg.content) || /https?:\/\/bit.ly\/\w/.test(msg.content)) fraudFlags++;

		if (/https?:\/\//.test(msg.content) && /\w+\.ru/.test(msg.content)) fraudFlags++;

		if (alphanumContent.includes('password')) fraudFlags++;

		return fraudFlags > 1;
	}

	isNitroFraud(msg, cleanedContent, alphanumContent) {
		let fraudFlags = 0;

		if (/(https?:)?\/\/bit.ly\/\w/.test(msg.content) && alphanumContent.includes('download')) fraudFlags++;

		if (this.nitroBads.reduce((acc, cur) => acc || alphanumContent.includes(cur), false)) fraudFlags++;

		return fraudFlags > 1;
	}

	hasKnownBad(msg) {
		this.knownBads.reduce((acc, cur) => acc || msg.content.includes(cur), false)
	}

};
