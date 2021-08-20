const { Command, Duration, Timestamp } = require('@aero/klasa');
const { MessageEmbed, GuildMember, User, Role, Permissions: { FLAGS } } = require('discord.js');
const { color: { VERY_NEGATIVE, POSITIVE }, emojis: { perms: { granted, unspecified }, infinity }, badges, url: { KSoftBans }, pronounDB } = require('../../../lib/util/constants');
const req = require('@aero/centra');
const { Ban, Warn } = require('@aero/drep');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['user', 'role', 'i'],
			description: language => language.get('COMMAND_INFO_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'VIEW_AUDIT_LOG'],
			usage: '[server|user:membername|role:rolename|userID:str{17,18}]'
		});

		this.timestamp = new Timestamp('MMMM d YYYY');

		this.perms = {
			ADMINISTRATOR: 'Administrator',
			VIEW_AUDIT_LOG: 'View Audit Log',
			MANAGE_GUILD: 'Manage Server',
			MANAGE_ROLES: 'Manage Roles',
			MANAGE_CHANNELS: 'Manage Channels',
			KICK_MEMBERS: 'Kick Members',
			BAN_MEMBERS: 'Ban Members',
			CREATE_INSTANT_INVITE: 'Create Instant Invite',
			CHANGE_NICKNAME: 'Change Nickname',
			MANAGE_NICKNAMES: 'Manage Nicknames',
			MANAGE_EMOJIS: 'Manage Emojis',
			MANAGE_WEBHOOKS: 'Manage Webhooks',
			VIEW_CHANNEL: 'Read Text Channels and See Voice Channels',
			SEND_MESSAGES: 'Send Messages',
			SEND_TTS_MESSAGES: 'Send TTS Messages',
			MANAGE_MESSAGES: 'Manage Messages',
			EMBED_LINKS: 'Embed Links',
			ATTACH_FILES: 'Attach Files',
			READ_MESSAGE_HISTORY: 'Read Message History',
			MENTION_EVERYONE: 'Mention Everyone',
			USE_EXTERNAL_EMOJIS: 'Use External Emojis',
			ADD_REACTIONS: 'Add Reactions',
			CONNECT: 'Connect',
			SPEAK: 'Speak',
			MUTE_MEMBERS: 'Mute Members',
			DEAFEN_MEMBERS: 'Deafen Members',
			MOVE_MEMBERS: 'Move Members',
			USE_VAD: 'Use Voice Activity',
			STREAM: 'Go Live'
		};

		this.regions = {
			'eu-central': 'Central Europe',
			india: 'India',
			london: 'London',
			japan: 'Japan',
			amsterdam: 'Amsterdam',
			brazil: 'Brazil',
			'us-west': 'US West',
			hongkong: 'Hong Kong',
			southafrica: 'South Africa',
			sydney: 'Sydney',
			europe: 'Europe',
			singapore: 'Singapore',
			'us-central': 'US Central',
			'eu-west': 'Western Europe',
			dubai: 'Dubai',
			'us-south': 'US South',
			'us-east': 'US East',
			frankfurt: 'Frankfurt',
			russia: 'Russia'
		};

		this.verificationLevels = {
			NONE: 'None',
			LOW: 'Low',
			MEDIUM: 'Medium',
			HIGH: '(╯°□°）╯︵ ┻━┻',
			VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
		};

		this.filterLevels = {
			DISABLED: "Don't scan any messages",
			MEMBERS_WITHOUT_ROLES: 'Scan messages from members without a role',
			ALL_MEMBERS: 'Scan messages by all members'
		};
	}

	async run(msg, [arg = msg.author]) {
		if (/^\d{17,18}$/.test(arg)) arg = await this.client.users.fetch(arg).catch(() => null);

		if (arg === this.client.user.id) return this.botinfo(msg);
		if (arg?.id === this.client.user.id) return this.botinfo(msg);
		if (arg instanceof User) return this.userinfo(msg, arg);
		if (arg instanceof GuildMember) return this.userinfo(msg, arg.user);
		if (arg instanceof Role) return this.roleinfo(msg, arg);
		if (msg.guild && arg === 'server') return this.serverinfo(msg);
		if (msg.guild && arg === msg.guild.id) return this.serverinfo(msg);
		if (!arg) return msg.responder.error('COMMAND_INFO_INVALIDID');

		return false;
	}

	async userinfo(msg, user) {
		const loading = await msg.channel.send(`${infinity} this might take a few seconds`);
		let embed = new MessageEmbed();
		embed = await this._addBaseData(user, embed);
		embed = await this._addBadges(user, embed);
		embed = await this._addMemberData(msg, user, embed);
		embed = await this._addSecurity(msg, user, embed);
		await msg.sendEmbed(embed);
		return loading.delete();
	}

	async _addBaseData(user, embed) {
		let authorString = `${user.tag} [${user.id}]`;
		const pdbRes = await req('https://pronoundb.org/api/v1')
			.path('/lookup')
			.query({
				platform: 'discord',
				id: user.id
			})
			.json();
		if (pdbRes.pronouns && pronounDB[pdbRes.pronouns]) authorString += ` (${pronounDB[pdbRes.pronouns]})`;
		return embed
			.setAuthor(authorString
				, user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(user.displayAvatarURL({ dynamic: true }));
	}

	async _addBadges(user, embed) {
		const bitfield = user.settings.get('badges');
		const out = badges.filter((_, idx) => bitfield & (1 << idx)); /* eslint-disable-line no-bitwise */
		if (!out.length) return embed;

		embed.setDescription(out.map(badge => `${badge.icon} ${badge.title}`).join('\n'));
		return embed;
	}

	async _addMemberData(msg, user, embed) {
		const member = msg.guild ? await msg.guild.members.fetch(user).catch(() => null) : null;
		const creator = member && (member.joinedTimestamp - msg.guild.createdTimestamp) < 3000;

		const statistics = [
			msg.language.get('COMMAND_INFO_USER_DISCORDJOIN', this.timestamp.display(user.createdAt), Duration.toNow(user.createdAt))
		];

		if (member) {
			statistics.push(msg.language.get(
				creator ? 'COMMAND_INFO_USER_GUILDRCEATE' : 'COMMAND_INFO_USER_GUILDJOIN',
				msg.guild.name,
				this.timestamp.display(member.joinedAt),
				Duration.toNow(member.joinedAt)));
			statistics.push(`${member.settings.get('stats.messages')} messages sent`);
		}

		const totalRep = user.settings.get('stats.reputation.total');
		if (totalRep) {
			const individualRep = user.settings.get('stats.reputation.individual').length;
			statistics.push(`+${totalRep} rep (${individualRep} individual upvoter${individualRep === 1 ? '' : 's'})`);
		}

		embed.addField(`• ${msg.language.get('COMMAND_INFO_USER_STATISTICS')}`, statistics.join('\n'));
		if (!member) return embed;

		const roles = member.roles.cache.sort((a, b) => b.position - a.position);
		let spacer = false;
		const roleString = roles
			.array()
			.filter(role => role.id !== msg.guild.id)
			.reduce((acc, role, idx) => {
				if (acc.length + role.name.length < 1010) {
					if (role.name === '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯') {
						spacer = true;
						return `${acc}\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`;
					} else {
						const comma = (idx !== 0) && !spacer ? ', ' : '';
						spacer = false;
						return acc + comma + role.name;
					}
				} else { return acc; }
			}, '');

		if (roles.size) {
			embed.addField(
				`• Role${roles.size > 2 ? `s (${roles.size - 1})` : roles.size === 2 ? '' : 's'}`,
				roleString.length ? roleString : msg.language.get('COMMAND_INFO_USER_NOROLES')
			);
		}

		const warnings = member.settings.get('warnings');
		if (warnings.length) {
			for (const { moderator } of warnings) await this.client.users.fetch(moderator);
			embed.addField(
				`• ${msg.language.get('COMMAND_INFO_USER_WARNINGS')} (${warnings.filter(warn => warn.active).length})`,
				warnings.map((warn, idx) => `${idx + 1}. ${!warn.active ? '~~' : ''}**${warn.reason}** | ${this.client.users.cache.get(warn.moderator).tag}${!warn.active ? '~~' : ''}`)
			);
		}
		const notes = member.settings.get('notes');
		if (notes.length) {
			for (const { moderator } of notes) await this.client.users.fetch(moderator);
			embed.addField(
				`• ${msg.language.get('COMMAND_INFO_USER_NOTES')} (${notes.length})`,
				notes.map((note, idx) => `${idx + 1}. **${note.reason}** | ${this.client.users.cache.get(note.moderator).tag}`)
			);
		}

		return embed;
	}

	async _addSecurity(msg, user, embed) {
		const KSoftBan = await this.client.ksoft.bans?.info(user.id).catch(() => null);
		const DRepInfraction = await this.client.drep?.infractions(user.id).catch(() => null);
		const DRepReputation = await this.client.drep?.rep(user.id).catch(() => ({ reputation: 0, staff: false })) ?? { reputation: 0, staff: false };
		const DRepProfile = `https://discordrep.com/u/${user.id}`;
		const CWProfile = await this.client.chatwatch?.profile?.(user.id)?.catch(() => ({ whitelisted: false, score: 50 })) ?? { whitelisted: false, score: 50 };
		const RiversideWhitelisted = await this.client.riverside.whitelist().then(whitelist => whitelist.includes(user.id));
		const RiversideProfile = await this.client.riverside.check(user.id);
		const rating = KSoftBan || CWProfile.blacklisted
			? 'COMMAND_INFO_TRUST_VERYLOW'
			: DRepInfraction instanceof Ban || DRepInfraction instanceof Warn || DRepReputation.reputation < 0 || CWProfile.score > 50
				? 'COMMAND_INFO_TRUST_LOW'
				: this.client.owners.has(user) || CWProfile.whitelisted
					? 'COMMAND_INFO_TRUST_VERYHIGH'
					: 'COMMAND_INFO_TRUST_HIGH';
		const cwRating = CWProfile.whitelisted
			? 'COMMAND_INFO_USER_CWWHITELISTED'
			: CWProfile.blacklisted
				? 'COMMAND_INFO_USER_CWBANNED'
				: CWProfile.score < 50
					? 'COMMAND_INFO_USER_CWGOOD'
					: CWProfile.score === 50
						? 'COMMAND_INFO_USER_CWNEUTRAL'
						: 'COMMAND_INFO_USER_CWBAD';
		const riversideRating = RiversideProfile.score === 0
			? 'COMMAND_INFO_USER_RIVERSIDEGOOD'
			: RiversideProfile.score < 50
				? 'COMMAND_INFO_USER_RIVERSIDESUSPICIOUS'
				: 'COMMAND_INFO_USER_RIVERSIDEBAD';

		const KSoftBansProfile = `${KSoftBans}?user=${user.id}`;
		const RiversideProfile = `https://discord.riverside.rocks/check?id=${user.id}&ref=aero`

		embed.addField(`• Trust (${msg.language.get(rating)})`, [
			KSoftBan?.active
				? msg.language.get('COMMAND_INFO_USER_KSOFTBANNED', KSoftBan.reason, KSoftBan.proof, KSoftBansProfile)
				: CWProfile.whitelisted
					? msg.language.get('COMMAND_INFO_USER_KSOFTSTAFF', KSoftBansProfile)
					: msg.language.get('COMMAND_INFO_USER_KSOFTCLEAN', KSoftBansProfile),
			msg.language.get(cwRating, KSoftBansProfile, CWProfile.blacklisted_reason),
			DRepInfraction instanceof Ban
				? msg.language.get('COMMAND_INFO_USER_DREPBANNED', DRepInfraction.reason)
				: DRepInfraction instanceof Warn
					? msg.language.get('COMMAND_INFO_USER_DREPWARNED', DRepInfraction.reason)
					: DRepReputation.reputation === 0
						? msg.language.get('COMMAND_INFO_USER_DREPNEUTRAL', DRepProfile)
						: DRepReputation.reputation > 0
							? DRepReputation.staff
								? msg.language.get('COMMAND_INFO_USER_DREPSTAFF', DRepProfile)
								: msg.language.get('COMMAND_INFO_USER_DREPPOSITIVE', DRepProfile)
							: msg.language.get('COMMAND_INFO_USER_DREPNEGATIVE', DRepProfile),
			RiversideWhitelisted
				? msg.language.get('COMMAND_INFO_USER_RIVERSIDEWHITELISTED', RiversideProfile)
				: msg.language.get(riversideRating, RiversideProfile.reportCount, RiversideProfile)
		].join('\n'));

		DRepInfraction instanceof Ban || DRepInfraction instanceof Warn || KSoftBan?.active || CWProfile.blacklisted || CWProfile.score > 80
			? embed.setColor(VERY_NEGATIVE)
			: embed.setColor(POSITIVE);

		return embed;
	}

	roleinfo(msg, role) {
		const [bots, humans] = role.members.partition(member => member.user.bot);
		const embed = new MessageEmbed()
			.setTitle(`${role.name} [${role.id}]`)
			.setColor(role.color)
			.addField('• Color', role.color ? role.hexColor : 'none', true)
			.addField('• Members', `${humans.size} human${humans.size === 1 ? '' : 's'}, ${bots.size} bot${bots.size === 1 ? '' : 's'}`, true)
			.addField('• Permissions', role.permissions.has(FLAGS.ADMINISTRATOR)
				? 'Administrator (all permissions)'
				: Object.entries(role.permissions.serialize()).filter(perm => perm[1]).map(([perm]) => this.perms[perm]).join(', ') || 'none', true)
			.addField('• Created', `${this.timestamp.display(role.createdAt)} (${Duration.toNow(role.createdAt)} ago)`, true)
			.addField('• Properties', [
				role.hoist
					? `${granted} displayed seperately`
					: `${unspecified} not displayed seperately`,
				role.mentionable
					? `${granted} mentionable as ${role.toString()}`
					: `${unspecified} not mentionable`,
				!role.managed
					? `${granted} configurable`
					: `${unspecified} managed by an integration`
			].join('\n'));
		return msg.sendEmbed(embed);
	}

	async serverinfo(msg) {
		const { guild } = msg;
		const toxicity = guild.settings.get('stats.toxicity');
		await msg.guild.members.fetch(msg.guild.ownerID);
		const embed = new MessageEmbed()
			.setAuthor(`${guild.name} [${guild.id}]`, guild.iconURL())
			.addField('• Created', `${this.timestamp.display(guild.createdAt)} (${Duration.toNow(guild.createdAt)} ago)`)
			.addField('• Members', `${guild.memberCount} (cached: ${guild.members.cache.size})`, true)
			.addField('• Voice region', this.regions[msg.guild.region], true)
			.addField('• Owner', `${guild.owner.user.tag} ${guild.owner.toString()} [${guild.ownerID}]`)
			.addField('• Statistics', `${guild.settings.get('stats.messages')} messages ${toxicity !== 0 ? `with an average toxicity of ${Math.round(toxicity * 100)}%` : ''} sent`)
			.addField('• Security', [
				`Verification level: ${this.verificationLevels[msg.guild.verificationLevel]}`,
				`Explicit filter: ${this.filterLevels[msg.guild.explicitContentFilter]}`
			].join('\n'));
		const icon = msg.guild.iconURL({ format: 'png' });
		if (icon) embed.setColor(await req(this.client.config.colorgenURL).path('dominant').query('image', icon).text());
		return msg.sendEmbed(embed);
	}

	botinfo(msg) {
		if (msg.guild && !msg.guild.me.permissions.has(FLAGS.EMBED_LINKS)) return msg.sendLocale('COMMAND_INFO_BOT');
		return msg.sendEmbed(new MessageEmbed()
			.setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(msg.language.get('COMMAND_INFO_BOT'))
		);
	}

};
