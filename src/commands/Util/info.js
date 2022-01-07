const { Command, Duration, Timestamp } = require('@aero/klasa');
const { MessageEmbed, GuildMember, User, Role, Permissions: { FLAGS } } = require('discord.js');
const {
	color: { VERY_NEGATIVE, POSITIVE, INFORMATION },
	emojis: { perms: { granted, unspecified }, infinity },
	badges,
	userInfo: { providers: providerMap, reasons: reasonMap }
} = require('../../../lib/util/constants');
const req = require('@aero/centra');

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
		const { pronouns, bans, trust, whitelists, sentinel } = await req('https://ravy.org/api/v1/')
			.path('/users')
			.path(user.id)
			.header('Authorization', process.env.RAVY_TOKEN)
			.json();
		embed = await this._addBaseData(user, embed, pronouns);
		embed = await this._addBadges(user, embed);
		embed = await this._addMemberData(msg, user, embed);
		embed = await this._addSecurity(msg, user, embed, bans, trust, whitelists, sentinel);
		await msg.sendEmbed(embed);
		return loading.delete();
	}

	async _addBaseData(user, embed, pronouns) {
		let authorString = `${user.tag} [${user.id}]`;
		if (pronouns !== 'unknown pronouns') authorString += ` (${pronouns})`;
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
					if (role.name.startsWith('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯')) {
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

	async _addSecurity(msg, user, embed, bans, trust, whitelists, sentinel) {
		const content = [
			...bans.map(ban =>
				msg.language.get('COMMAND_INFO_USER_BANNED',
					providerMap[ban.provider] || ban.provider,
					reasonMap[ban.reason] || ban.reason || 'unknown reason'
				)
			),
			...whitelists.map(entry => msg.language.get('COMMAND_INFO_USER_WHITELISTED', providerMap[entry.provider] || entry.provider))
		];

		if (sentinel.verified) content.push(msg.language.get('COMMAND_INFO_USER_SENTINEL'));

		embed.addField(`• Trust (${trust.label})`, content.length ? content.join('\n') : msg.language.get('COMMAND_INFO_USER_NEUTRAL'));

		if (trust.level === 3) embed.setColor(INFORMATION);
		else if (trust.level < 3) embed.setColor(VERY_NEGATIVE);
		else if (trust.level > 3) embed.setColor(POSITIVE);

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
		await msg.guild.members.fetch(msg.guild.ownerID);
		const embed = new MessageEmbed()
			.setAuthor(`${guild.name} [${guild.id}]`, guild.iconURL())
			.addField('• Created', `${this.timestamp.display(guild.createdAt)} (${Duration.toNow(guild.createdAt)} ago)`)
			.addField('• Members', `${guild.memberCount} (cached: ${guild.members.cache.size})`, true)
			.addField('• Voice region', this.regions[msg.guild.region], true)
			.addField('• Owner', `${guild.owner.user.tag} ${guild.owner.toString()} [${guild.ownerID}]`)
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
