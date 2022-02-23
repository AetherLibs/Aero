const { Monitor } = require('@aero/klasa');
const http = require('@aero/http');
const leven = require('js-levenshtein');
const sanitize = require('@aero/sanitizer');

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
			'discord.com/nitro', 'discord.gift'
		];
		this.exemptions = [
			'discord.com', 'discord.new', 'discord.gg', 'discord.io', 'discord.me', 'discords.com',
			'cdn.discordapp.com', 'discordapp.com', 'media.discordapp.com', 'discord.bio',
			'discord.js', 'discord.js.org', 'discord.py', 'discord.id', 'discordgift.site', 'discord.net',
			'tenor.com', 'imgur.com'
		];
		this.knownBads = [
			'stencommunity.com', 'stearncomminuty.ru', 'streancommuntiy.com', 'stearncommunytu.ru', 'steamcommunyru.com', 'csgocyber.ru',
			'store-steampowereb.com', 'steamcommunityz.com', 'store-stempowered.com', 'steamcommunitlu.com',
			'discrod-nitro.fun', 'nitro-discord.com', 'discordgivenitro.com', 'steamgivenitro.com', 'giveawayd.shop', 'lildurk.com',
			'discord-glft.com',
			'nnirror.co.uk', 'cointrackguide.com', 'profitcoinnow.com'
		];
		this.steamBads = ['csgo', 'trade', 'knife', 'steam', 'skins', 'sale'];
		this.nitroBads = ['nitro', 'generator', 'free'];
		this.financeBads = ['bitcoin', 'profits', 'trading', 'algorithm', 'reveal', 'high'];
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.scams') || msg.exempt) return;

		const cleanedContent = sanitize(msg.content).toLowerCase();
		const alphanumContent = cleanedContent.replace(/[\W]+/g, '');

		const rawLinks = [...msg.content
			.replace(/\x00/g, '') /* eslint-disable-line no-control-regex */
			.matchAll(/\b((?:https?:\/\/)?[\w-]+\.[\w-%~#./]+)\b/g)
		].map(i => i[1]);

		const parsedLinks = [...new Set(
			rawLinks.map(link => link.startsWith('http') ? link : `https://${link}`)
		)]
			.map(href => {
				try {
					const url = new URL(href);
					return url;
				} catch {
					return false;
				}
			}).filter(i => !!i);

		const processedLinks = parsedLinks.map(url => url.hostname.toLowerCase());

		if (this.hasKnownBad(msg)
			// || this.matchesBadLevenshtein(msg, processedLinks)
			|| this.isSteamFraud(msg, cleanedContent, alphanumContent)
			|| this.isNitroFraud(msg, cleanedContent, alphanumContent, processedLinks)
			|| this.isFinancialFraud(msg, cleanedContent, alphanumContent)
			|| await this.isFraudulentByAPI(parsedLinks, msg.author.id, msg)
		)
			msg.guild.members.ban(msg.author.id, { reason: msg.language.get('MONITOR_ANTI_SCAMS', msg.content), days: 1 });
	}

	isSteamFraud(msg, cleanedContent, alphanumContent) {
		let fraudFlags = 0;

		fraudFlags += this.steamBads.reduce((acc, cur) => acc + alphanumContent.includes(cur), 0);

		if (/https?:\/\/str?(ea|ae)(m|n|rn)c/.test(msg.content)
			|| /str?(ea|ae)(m|n|rn)comm?(unt?(i|y)t?(y|u))|(inuty)\.\w/.test(msg.content)
			|| /https?:\/\/bit.ly\/\w/.test(msg.content)
			|| /(https?:)?store-stea?mpo?we?re?(d|b)/.test(msg.content)
		) fraudFlags++;

		if (/https?:\/\//.test(msg.content) && /\w+\.ru/.test(msg.content)) fraudFlags++;

		if (alphanumContent.includes('password')) fraudFlags++;

		return fraudFlags > 2;
	}

	isNitroFraud(msg, cleanedContent, alphanumContent) {
		let fraudFlags = 0;

		if (/(https?:\/\/)?bit.ly\/\w/.test(msg.content) && alphanumContent.includes('download')) fraudFlags++;

		if (/(https?:\/\/)?disc(or|ro)d-?nitro/.test(msg.content)) fraudFlags++;
		if (/(https?:\/\/)?nitro-?disc(or|ro)d/.test(msg.content)) fraudFlags++;

		fraudFlags += this.nitroBads.reduce((acc, cur) => acc + alphanumContent.includes(cur), 0);

		return fraudFlags > 2;
	}

	isFinancialFraud(msg, cleanedContent, alphanumContent) {
		if (this.financeBads.reduce((acc, cur) => acc + alphanumContent.includes(cur), 0) >= 5) return true;
		return false;
	}

	hasKnownBad(msg) {
		this.knownBads.reduce((acc, cur) => acc || msg.content.includes(cur), false);
	}

	matchesBadLevenshtein(msg, processedLinks) {
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

	async isFraudulentByAPI(links, authorId, msg) {
		const statuses = await Promise.all(links.map(async link => {
			const req = http('https://ravy.org/api/v1')
				.header('Authorization', process.env.RAVY_TOKEN)
				.query('author', authorId)
				.path('/urls')
				.path(encodeURIComponent(link.href));

			if (process.env.PHISHERMAN_TOKEN && msg.guild) {
				const member = await msg.guild.members.fetch(process.env.PHISHERMAN_USER).catch(() => null);

				if (member && member.hasPermission('ADMINISTRATOR')) {
					req.query('phisherman_token', process.env.PHISHERMAN_TOKEN);
					req.query('phisherman_user', process.env.PHISHERMAN_USER);
				}
			}

			const res = await req.json();

			return res;
		}));

		return statuses.reduce((acc, cur) => acc || cur.isFraudulent, false);
	}

};
