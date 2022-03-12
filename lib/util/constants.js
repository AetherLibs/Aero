const { objectFlip } = require('./util');

const pronounDB = {
	hh: 'he/him',
	hi: 'he/it',
	hs: 'he/she',
	ht: 'he/they',
	ih: 'it/him',
	ii: 'it/its',
	is: 'it/she',
	it: 'it/they',
	shh: 'she/he',
	sh: 'she/her',
	si: 'she/it',
	st: 'she/they',
	th: 'they/he',
	ti: 'they/it',
	ts: 'they/she',
	tt: 'they/them',
	any: 'any pronouns',
	other: 'other pronouns',
	ask: 'ask for pronouns',
	avoid: 'avoid pronouns, use name'
};

/* eslint-disable no-bitwise */
module.exports = {
	BRAIN_MEME_ID: 93895088,
	DISCORD_ACTIVITY_YOUTUBE: '755600276941176913',
	DISCORD_EMBEDDED_APPLICATION_TYPE: 2,

	emojis: {
		success: '<:success:952070716335984690>',
		error: '<:error:952070715388088360>',
		yes: '<:success:952070716335984690>',
		no: '<:error:952070715388088360>',
		infinity: '<a:loading_infinity:952074099243491399>',
		plus: '<:plus:952074472683368468>',
		minus: '<:minus:952074473140523009>',
		trusted: '<:trust_trusted:952074474847604736>',
		banned: '<:trust_banned:952074475694862379>',
		nodata: '<:trust_none:952074476969926736>',
		perms: {
			granted: '<:perms_granted:952070510131421265>',
			unspecified: '<:perms_unspecified:952070511066775552>',
			denied: '<:perms_denied:952070506885034104>'
		},
		covid: {
			cases: '<:covid_cases:952075644467048459>',
			deaths: '<:covid_deaths:952075643020005436>',
			recoveries: '<:covid_recoveries:952075637458370560>',
			tests: '<:covid_tests:952075638326591528>'
		},
		sentinel: '<:aero_sentinel:928122479338209341>',
		sentinelOff: '<:aero_sentinel_off:933129548470579281>'
	},

	reactions: {
		success: 'success:952070716335984690',
		error: 'error:952070715388088360',
		yes: 'success:952070716335984690',
		no: 'error:952070715388088360',
		infinity: 'loading_infinity:952074099243491399',
		lock: 'lock_closed:952074970610139156',
		unlock: 'lock_open:952074969574150184',
		plus: 'plus:952074472683368468',
		minus: 'minus:952074473140523009',
		fallbackYes: '✅',
		fallbackNo: '❌'
	},

	poll: {
		1: '1️⃣',
		2: '2️⃣',
		3: '3️⃣',
		4: '4️⃣',
		5: '5️⃣',
		6: '6️⃣',
		7: '7️⃣',
		8: '8️⃣',
		9: '9️⃣',
		10: '🔟'
	},

	color: {
		VERY_NEGATIVE: 'C24D4D',
		NEGATIVE: 'c27d4c',
		SLIGHTLY_NEGATIVE: 'c2ae4c',
		POSITIVE: '3fb97c',
		INFORMATION: '4c87c2'
	},

	log: {
		// mod actions
		ban: {
			type: 'moderation',
			icon: 'https://cdn.discordapp.com/emojis/492978447170404353.png',
			color: 'VERY_NEGATIVE'
		},
		unban: {
			type: 'moderation',
			icon: '',
			color: 'POSITIVE'
		},
		tempban: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATUVE'
		},
		tempbanEnd: {
			type: 'moderation',
			icon: '',
			color: 'INFORMATION'
		},
		softban: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		globalBan: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		globalUnban: {
			type: 'moderation',
			icon: '',
			color: 'POSITIVE'
		},
		bulkBan: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		kick: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		mute: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		unmute: {
			type: 'moderation',
			icon: '',
			color: 'POSITIVE'
		},
		tempmute: {
			type: 'moderation',
			icon: '',
			color: 'VERY_NEGATIVE'
		},
		tempmuteEnd: {
			type: 'moderation',
			icon: '',
			color: 'INFORMATION'
		},
		warn: {
			type: 'moderation',
			icon: '',
			color: 'NEGATIVE'
		},
		unwarn: {
			type: 'moderation',
			icon: '',
			color: 'POSITIVE'
		},

		// message logging
		messageEdited: {
			type: 'messages',
			icon: '',
			color: 'INFORMATION'
		},
		messageDeleted: {
			type: 'messages',
			icon: '',
			color: 'INFORMATION'
		},
		inviteDeleted: {
			type: 'messages',
			icon: '',
			color: 'NEGATIVE'
		},
		messagesPurged: {
			type: 'messages',
			icon: '',
			color: 'NEGATIVE'
		},

		// member logging
		memberJoined: {
			type: 'members',
			icon: '',
			color: 'INFORMATION'
		},
		memberPassedGate: {
			type: 'members',
			icon: '',
			color: 'INFORMATION'
		},
		memberLeft: {
			type: 'members',
			icon: '',
			color: 'INFORMATION'
		}
	},

	// urls
	url: {
		NekoAPI: 'https://nekos.life/api/v2/img/',
		PerspectiveAPI: 'https://commentanalyzer.googleapis.com/v1alpha1/',
		ImgurAPI: 'https://api.imgur.com/3',
		DiscordStatus: 'https://status.discord.com',
		AeroStatus: 'https://status.aero.bot'
	},

	badges: [
		{
			icon: '<:aero_badge_dev:804893795166584832>',
			title: 'Aero Contributor'
		},
		{
			icon: '<:aero_badge_veri:804893795246276608>',
			title: 'Trusted User'
		},
		{
			icon: '<:aero_badge_cute:804893795111534592>',
			title: 'Certified Cutie'
		},
		{
			icon: '<:aero_badge_w21:927006000635072554>',
			title: '2021/22 Winter Event Participant'
		},
		{
			icon: '<:aero_badge_docs:937594889099685889>',
			title: 'Documentation Scribe'
		},
		{
			icon: '<:aero_badge_support:937594925715951706>',
			title: 'Community Support'
		}
	],

	regexes: {
		imgur: {
			image: /^https?:\/\/i\.imgur\.com\/(\w+)\.(?:jpg|png)$/i,
			album: /^https?:\/\/imgur\.com(?:\/a)?\/(\w+)$/i
		},
		discord: {
			cdn: /^https:\/\/cdn.discordapp.com\/attachments\/(?:\d){17,19}\/(?:\d){17,19}\/(?:.+?)(?:.png|.jpg)$/i
		},
		cancel: /^(?:cancel|stop|end)$/i,
		emoji: new RegExp(`^${require('emoji-regex')().source}$`)
	},

	userInfo: {
		providers: {
			ravy: 'the ravy.org trust meta-database',
			riverside: 'the Riverside Rocks dangerous Discord user database',
			ksoft: 'the KSoft.Si Discord ban archive',
			drep: 'the DiscordRep reputation database',
			dservices: 'the Discord.Services ban archive',
			azrael: 'the Azrael Interactive global ban database',
			frisky: 'Extra Frisky\'s list of known scammers'
		}
	},

	intents: {
		GUILDS: 1 << 0,
		/*
		 * GUILD_CREATE
		 * GUILD_DELETE
		 * GUILD_ROLE_CREATE
		 * GUILD_ROLE_UPDATE
		 * GUILD_ROLE_DELETE
		 * CHANNEL_CREATE
		 * CHANNEL_UPDATE
		 * CHANNEL_DELETE
		 * CHANNEL_PINS_UPDATE
		 */
		GUILD_MEMBERS: 1 << 1,
		/*
		 * GUILD_MEMBER_ADD
		 * GUILD_MEMBER_UPDATE
		 * GUILD_MEMBER_REMOVE
		 */
		GUILD_BANS: 1 << 2,
		/*
		 * GUILD_BAN_ADD
		 * GUILD_BAN_REMOVE
		 */
		GUILD_EMOJIS: 1 << 3,
		/*
		 * GUILD_EMOJIS_UPDATE
		 */
		GUILD_INTEGRATIONS: 1 << 4,
		/*
		 * GUILD_INTEGRATIONS_UPDATE
		 */
		GUILD_WEBHOOKS: 1 << 5,
		/*
		 * WEBHOOKS_UPDATE
		 */
		GUILD_INVITES: 1 << 6,
		/*
		 * INVITE_CREATE
		 * INVITE_DELETE
		 */
		GUILD_VOICE_STATES: 1 << 7,
		/*
		 * VOICE_STATE_UPDATE
		 */
		GUILD_PRESENCES: 1 << 8,
		/*
		 * PRESENCE_UPDATE
		 */
		GUILD_MESSAGES: 1 << 9,
		/*
		 * MESSAGE_CREATE
		 * MESSAGE_UPDATE
		 * MESSAGE_DELETE
		 */
		GUILD_MESSAGE_REACTIONS: 1 << 10,
		/*
		 * MESSAGE_REACTION_ADD
		 * MESSAGE_REACTION_REMOVE
		 * MESSAGE_REACTION_REMOVE_ALL
		 * MESSAGE_REACTION_REMOVE_EMOJI
		 */
		GUILD_MESSAGE_TYPING: 1 << 11,
		/*
		 * TYPING_START
		 */
		DIRECT_MESSAGES: 1 << 12,
		/*
		 * CHANNEL_CREATE
		 * MESSAGE_CREATE
		 * MESSAGE_UPDATE
		 * MESSAGE_DELETE
		 */
		DIRECT_MESSAGE_REACTIONS: 1 << 13,
		/*
		 * MESSAGE_REACTION_ADD
		 * MESSAGE_REACTION_REMOVE
		 * MESSAGE_REACTION_REMOVE_ALL
		 * MESSAGE_REACTION_REMOVE_EMOJI
		 */
		DIRECT_MESSAGE_TYPING: 1 << 14
		/*
		 * TYPING_START
		 */
	},

	punishments: {
		NONE: 1 << 0,
		STRIKE: 1 << 1,
		TEMPMUTE: 1 << 2,
		MUTE: 1 << 3,
		TEMPBAN: 1 << 4,
		BAN: 1 << 5
	},

	discordBadges: {
		staff: '<:discord_badge_staff:804194287868051496>',
		earlySupporter: '<:discord_badge_early_supporter:804194287817981952>',
		verifiedDeveloper: '<:discord_badge_veri_developer:804194287910256640>',
		partner: '<:discord_badge_partner:804194576788357131>',
		nitro: '<:discord_badge_nitro:804194287557542000>',
		hypesquadEvents: '<:discord_badge_hypesquad_events:804194287700148265>',
		hypesquadBrilliance: '<:discord_badge_brilliance:804194287884435466>',
		hypesquadBravery: '<:discord_badge_bravery:804194287569993759>',
		hypesquadBalance: '<:discord_badge_balance:804194287818375208>',
		boosting1: '<:discord_badge_boosting_1:804194287872376853>',
		bughunter1: '<:discord_badge_bughunter_1:804194287813394462>',
		bughunter2: '<:discord_badge_bughunter_2:804194287830827058>',
		bot: '<:discord_badge_bot:804196317852336159>',
		verifiedBot: '<:discord_badge_verified_bot:804196318134009866>'
	},

	kaomoji: [
		'(*^ω^)',
		'(◕‿◕✿)',
		'(◕ᴥ◕)',
		'ʕ•ᴥ•ʔ',
		'ʕ￫ᴥ￩ʔ',
		'(*^.^*)',
		'owo',
		'OwO',
		'(｡♥‿♥｡)',
		'uwu',
		'UwU',
		'(*￣з￣)',
		'>w<',
		'^w^',
		'(つ✧ω✧)つ',
		'(/ =ω=)/',
		'^v^'
	],

	pronounDB,
	pronounMapping: objectFlip(pronounDB)

};

module.exports.noop = () => { }; /* eslint-disable-line no-empty-function */

module.exports.zws = '\u200B';
