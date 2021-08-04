const { Monitor } = require('@aero/klasa');
const leven = require('js-levenshtein');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});

		this.knownGoods = ['steamcommunity.com', 'store.steampowered.com', 'discord.gift', 'steampowered.com', 'disord.com/nitro'];
		this.exemptions = ['discord.com', 'discord.new', 'discord.gg', 'discord.io', 'discord.me', 'discords.com', 'cdn.discordapp.com', 'discordapp.com', 'media.discordapp.com', 'discord.bio', 'discords.com'];
		this.knownBads = [
			'stencommunity.com', 'stearncomminuty.ru', 'streancommuntiy.com', 'stearncommunytu.ru', 'steamcommunyru.com', 'csgocyber.ru',
			'store-steampowereb.com', 'steamcommunityz.com', 'store-stempowered.com',
			'discrod-nitro.fun', 'nitro-discord.com', 'discordgivenitro.com', 'steamgivenitro.com', 'giveawayd.shop', 'lildurk.com'
		];
		this.steamBads = ['csgo', 'trade', 'knife', 'steam', 'skins', 'sale'];
		this.nitroBads = ['nitro', 'generator', 'free'];
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.scams') || msg.exempt) return;
		
		const cleanedContent = require('@aero/sanitizer')(msg.content).toLowerCase();
		const alphanumContent = cleanedContent.replace(/[\W]+/g, '');

		if (this.hasKnownBad(msg)
			|| this.matchesBadLevenshtein(msg)
			|| this.isSteamFraud(msg, cleanedContent, alphanumContent)
			|| this.isNitroFraud(msg, cleanedContent, alphanumContent)) {
			msg.guild.members.ban(msg.author.id, { reason: msg.language.get('MONITOR_ANTI_SCAMS', msg.content), days: 1 });
		}
	}

	isSteamFraud(msg, cleanedContent, alphanumContent) {
		let fraudFlags = 0;

		if (this.steamBads.reduce((acc, cur) => acc || alphanumContent.includes(cur), false)) fraudFlags++;

		if (/https?:\/\/str?(ea|ae)(m|n|rn)c/.test(msg.content)
			|| /str?(ea|ae)(m|n|rn)comm?(unt?(i|y)t?(y|u))|(inuty)\.\w/.test(msg.content)
			|| /https?:\/\/bit.ly\/\w/.test(msg.content)
			|| /(https?:)?store-stea?mpo?we?re?(d|b)/.test(msg.content)
			) fraudFlags++;

		if (/https?:\/\//.test(msg.content) && /\w+\.ru/.test(msg.content)) fraudFlags++;

		if (alphanumContent.includes('password')) fraudFlags++;

		return fraudFlags > 1;
	}

	isNitroFraud(msg, cleanedContent, alphanumContent) {
		let fraudFlags = 0;

		if (/(https?:\/\/)?bit.ly\/\w/.test(msg.content) && alphanumContent.includes('download')) fraudFlags++;

		if (alphanumContent.includes('free') && alphanumContent.includes('nitro')) fraudFlags++;

		if (/(https?:\/\/)?disc(or|ro)d-?nitro/.test(msg.content)) fraudFlags++;
		if (/(https?:\/\/)?nitro-?disc(or|ro)d/.test(msg.content)) fraudFlags++;

		if (this.nitroBads.reduce((acc, cur) => acc || alphanumContent.includes(cur), false)) fraudFlags++;

		return fraudFlags > 1;
	}

	hasKnownBad(msg) {
		this.knownBads.reduce((acc, cur) => acc || msg.content.includes(cur), false)
	}

	matchesBadLevenshtein(msg) {
		const rawLinks = msg.content.split(/\s+/).filter(possible => /^(https?:\/\/)?[\w-]+\.\w+/.test(possible));

		const processedLinks = rawLinks.map(link => link.startsWith('http') ? link : `https://${link}`).map(href => {
			try {
				const url = new URL(href);
				return url;
			} catch {
				return false;
			}
		}).filter(i => !!i).map(url => url.hostname.toLowerCase());

		return processedLinks.reduce((acc, link) => {
			if (acc) return true;
			if (this.exemptions.includes(link)) return acc;
			for (const knownGood of this.knownGoods) {
				if (link === knownGood) continue;
				const distance = leven(link, knownGood);
				if (distance > 0 && distance < 8) return true;
			}
			return acc;
		}, false);
	}

};
