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

		this.knownGoods = [
			'steamcommunity.com', 'store.steampowered.com', 'steampowered.com',
			'disord.com/nitro', 'discord.gift'
		];
		this.exemptions = [
			'discord.com', 'discord.new', 'discord.gg', 'discord.io', 'discord.me', 'discords.com',
			'cdn.discordapp.com', 'discordapp.com', 'media.discordapp.com', 'discord.bio',
			'tenor.com', 'imgur.com'
		];
		this.knownBads = [
			'stencommunity.com', 'stearncomminuty.ru', 'streancommuntiy.com', 'stearncommunytu.ru', 'steamcommunyru.com', 'csgocyber.ru',
			'store-steampowereb.com', 'steamcommunityz.com', 'store-stempowered.com', 'steamcommunitlu.com',
			'discrod-nitro.fun', 'nitro-discord.com', 'discordgivenitro.com', 'steamgivenitro.com', 'giveawayd.shop', 'lildurk.com',
			'nnirror.co.uk', 'cointrackguide.com', 'profitcoinnow.com'
		];
		this.steamBads = ['csgo', 'trade', 'knife', 'steam', 'skins', 'sale'];
		this.nitroBads = ['nitro', 'generator', 'free'];
		this.financeBads = ['bitcoin', 'profits', 'trading', 'algorithm', 'reveal', 'high'];
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.scams') || msg.exempt) return;
		
		const cleanedContent = require('@aero/sanitizer')(msg.content).toLowerCase();
		const alphanumContent = cleanedContent.replace(/[\W]+/g, '');

		const rawLinks = msg.content.split(/\s+/).filter(possible => /^(https?:\/\/)?[\w-]+\.\w+/.test(possible));

		const processedLinks = rawLinks.map(link => link.startsWith('http') ? link : `https://${link}`).map(href => {
			try {
				const url = new URL(href);
				return url;
			} catch {
				return false;
			}
		}).filter(i => !!i).map(url => url.hostname.toLowerCase());

		if (this.hasKnownBad(msg)
			|| this.matchesBadLevenshtein(msg, processedLinks)
			|| this.isSteamFraud(msg, cleanedContent, alphanumContent)
			|| this.isNitroFraud(msg, cleanedContent, alphanumContent, processedLinks)
			|| this.isFinancialFraud(msg, cleanedContent, alphanumContent)
		) {
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

	isNitroFraud(msg, cleanedContent, alphanumContent, processedLinks) {
		let fraudFlags = 0;

		if (/(https?:\/\/)?bit.ly\/\w/.test(msg.content) && alphanumContent.includes('download')) fraudFlags++;

		if (processedLinks.reduce((accumulator, link) => {
				if (accumulator) return accumulator;
				return this.nitroBads.reduce((acc, cur) => acc || link.includes(cur), false) || accumulator;
		}, false)) fraudFlags++;

		if (/(https?:\/\/)?disc(or|ro)d-?nitro/.test(msg.content)) fraudFlags++;
		if (/(https?:\/\/)?nitro-?disc(or|ro)d/.test(msg.content)) fraudFlags++;

		if (this.nitroBads.reduce((acc, cur) => acc || alphanumContent.includes(cur), false)) fraudFlags++;

		return fraudFlags > 1;
	}

	isFinancialFraud(msg, cleanedContent, alphanumContent) {
		if (this.financeBads.reduce((acc, cur) => acc + alphanumContent.includes(cur), 0) >= 5) return true;
	}

	hasKnownBad(msg) {
		this.knownBads.reduce((acc, cur) => acc || msg.content.includes(cur), false)
	}

	matchesBadLevenshtein(msg, processedLinks) {
		return processedLinks.reduce((acc, link) => {
			if (acc) return true;
			if (this.exemptions.includes(link)) return acc;
			for (const knownGood of this.knownGoods) {
				if (link === knownGood) continue;
				const distance = leven(link, knownGood);
				if (distance > 0 && distance < 8 * (knownGood.length / 22)) return true;
			}
			return acc;
		}, false);
	}

};
