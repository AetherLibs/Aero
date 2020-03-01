/* eslint-disable no-bitwise */
module.exports = {
	BRAIN_MEME_ID: 93895088,
	emojis: {
		success: '<:aero_success:683716849254269035>',
		error: '<:aero_error:683717124253941794>',
		yes: '<:aero_success:683716849254269035>',
		no: '<:aero_no:683716848444768382>',
		infinity: '<a:aero_infinity:641773728157663232>',
		plus: '<:aero_plus:683720859357151292>',
		minus: '<:aero_minus:683720858099122291>',
		perms: {
			granted: '<:aero_perms_granted:589498583364009995>',
			unspecified: '<:aero_perms_unspecified:642754484719845416>',
			denied: '<:aero_perms_denied:589499156637417483>'
		}
	},
	reactions: {
		success: 'aero_success:683716849254269035',
		error: 'aero_error:683717124253941794',
		yes: '683716849254269035',
		no: '683717124253941794',
		infinity: 'aero_infinity:641773728157663232',
		lock: 'aero_lock:683718295287103490',
		unlock: 'aero_unlock:683718296121507890',
		plus: 'aero_plus:683720859357151292',
		minus: 'aero_minus:683720858099122291'
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

		// member logging
		memberJoined: {
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
		ImgurAPI: 'https://api.imgur.com/3'
	},
	badges: [
		{
			icon: '<:Badge_Contrib:657994896539516946>',
			title: 'Aero Contributor'
		},
		{
			icon: '<:Badge_Veri:657994545363025930>',
			title: 'Trusted User'
		}
	],
	regexes: {
		imgur: {
			image: /^https?:\/\/i\.imgur\.com\/(\w+)\.(?:jpg|png)$/i,
			album: /^https?:\/\/imgur\.com\/a\/(\w+)$/i
		},
		discord: {
			cdn: /^https:\/\/cdn.discordapp.com\/attachments\/(?:\d){17,19}\/(?:\d){17,19}\/(?:.+?)(?:.png|.jpg)$/i
		},
		cancel: /^(?:cancel|stop|end)$/i
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

	// based on https://web.archive.org/web/20190305022231/http://discord.services/bans
	DServicesBans: new Map()
		.set('272368290700197899', { reason: 'spamming invite links', proof: 'https://i.imgur.com/fRtOMuB.png' })
		.set('334566239026282497', { reason: 'Dm advertisments', proof: 'https://i.imgur.com/JXa1D3K.png' })
		.set('267987177474883584', { reason: 'Alt of Bailey, 262626452745224192 Extensively Used to carry out the same stuff', proof: 'https://haste.cloudy.gg/amezupusiw.md' })
		.set('322303888764174346', { reason: 'Alt of Bailey, 262626452745224192 Extensively Used to carry out the same stuff', proof: 'https://haste.cloudy.gg/amezupusiw.md' })
		.set('356095079401783296', { reason: 'dm advertisments', proof: 'https://haste.cloudy.gg/amezupusiw.md' })
		.set('211576396068290560', { reason: 'Mass DMing people with server link.', proof: 'https://i.imgur.com/kpmDXQa.png' })
		.set('356100346264813568', { reason: 'dm advertisments', proof: 'https://i.imgur.com/4lghKMk.png' })
		.set('262626452745224192', { reason: 'Generally a bad user, toxic, manipulative.', proof: 'https://haste.cloudy.gg/amezupusiw.md' })
		.set('253692467646300161', { reason: 'Spam/Raiding', proof: 'https://i.imgur.com/txS5oQa.png' })
		.set('245985043300745218', { reason: 'Spamming invite links into chat', proof: 'https://i.imgur.com/FrIOvfy.png' })
		.set('240863082736386048', { reason: 'spam', proof: 'https://i.imgur.com/JJgSaDD.gif' })
		.set('208766704619225088', { reason: 'violation of Community guidelines', proof: 'https://i.imgur.com/lPIWaQZ.jpg' })
		.set('490244147589021700', { reason: 'Harassment, Threats, All around Cunt', proof: 'https://haste.cloudy.gg/amezupusiw.md' })
		.set('263179549062332417', { reason: 'Attempting to send invite links into chat and then to dm\'s after failing.', proof: 'https://i.imgur.com/1l68Aip.png' })
		.set('258568289746288641', { reason: 'Spamming invite links and admitting he joined a server to spam and advertise', proof: 'https://i.imgur.com/vuyEzFH.png' })
		.set('164192314611335168', { reason: 'Spam/Raid', proof: 'https://i.imgur.com/Npezs5U.png' })
		.set('254395557768855553', { reason: 'raiding', proof: 'https://i.imgur.com/BsTMwcD.gif' })
		.set('340760776685912064', { reason: 'dm advertisments', proof: 'https://i.imgur.com/SS9FPCN.png' })
		.set('214497535962775552', { reason: 'Spam/Raid', proof: 'https://i.imgur.com/S8NxQ6x.png' })
		.set('190850532863246336', { reason: 'spam', proof: 'https://i.imgur.com/2Obg0w2.png' })
		.set('252124597959262218', { reason: 'dm advertisments', proof: 'https://i.imgur.com/Uo6B7XC.png' })
		.set('194953358602272769', { reason: 'raiding', proof: 'https://i.imgur.com/BsTMwcD.gif' })
		.set('161290207080087552', { reason: 'spam', proof: 'https://i.imgur.com/qQehuVO.gif' })
		.set('139115497567420417', { reason: 'mention spammer', proof: 'https://i.imgur.com/HNqcY2j.png' })
		.set('333433591755177994', { reason: 'NSFW Image Spam', proof: 'https://i.imgur.com/gstYeaU.png' })
		.set('233052860596748289', { reason: 'Trolling, Harrasment, Fake Reviews', proof: 'https://i.imgur.com/9Rs0HcGr.jpg' })
		.set('129743780050894848', { reason: 'Violation of discord guidelines, and violant threats.', proof: 'https://i.imgur.com/pAiL08J.png' })
		.set('196501452104007680', { reason: 'spam', proof: 'https://i.imgur.com/vbKYIDV.png' })
		.set('343864428242010123', { reason: 'Raiding - Link Spamming', proof: 'https://i.imgur.com/cpGxDr5.jpg' })

};

module.exports.noop = () => { }; /* eslint-disable-line no-empty-function */

module.exports.zws = '\u200B';
