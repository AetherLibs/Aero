const { log, noop, color: colors } = require('./util/constants');
const { Duration } = require('@aero/klasa');
const { MessageEmbed, GuildMember } = require('discord.js');
const reflectors = [
	'toString', 'valueOf', 'inspect', 'constructor',
	Symbol.toPrimitive, Symbol.for('util.inspect.custom'),
	'guild', 'webhooks'
];

class GuildLogger {

	constructor(guild) {
		this.guild = guild;
		this.webhooks = {
			moderation: null,
			messages: null,
			members: null
		};

		const handler = {
			get: (obj, prop) => {
				if (reflectors.includes(prop)) return { webhooks: this.webhooks, guild: this.guild }[prop];
				if (!log[prop]) return noop;
				return (arg) => {
					obj.send({ type: log[prop].type, action: prop, color: colors[log[prop].color], ...arg });
				};
			}
		};

		return new Proxy(this, handler);
	}

	async send({ type, action, color, user, users, member, moderator, reason, duration, message, channel, oldMessage, newMessage, msg }) {
		if (msg?.flagArgs.dm) this.dm({ action, moderator, reason, duration, user, users, guild: msg.guild, msg });
		if (!this.webhooks[type]) {
			const succeeded = await this.updateHook(type);
			if (!succeeded) return;
		}
		if (user && typeof user === 'string') user = await this.guild.client.users.fetch(user);
		if (user instanceof GuildMember) user = user.user; /* eslint-disable-line prefer-destructuring */
		if (moderator && typeof moderator === 'string') moderator = await this.guild.client.users.fetch(moderator);
		if (duration && duration instanceof Date) duration = Duration.toNow(duration);

		const content = [
			user
				? this.guild.language.get('LOG_ARGS_USER', user.tag, user.toString(), user.id)
				: null,
			users
				? this.guild.language.get('LOG_ARGS_USERS', users.map(usr => typeof usr === 'string' ? usr : usr.id).join(', '))
				: null,
			channel
				? this.guild.language.get('LOG_ARGS_CHANNEL', channel.name, channel.toString(), channel.id)
				: null,
			member
				? this.guild.language.get('LOG_ARGS_MEMBER', member.displayName !== member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag, member.user.toString(), member.id)
				: null,
			reason
				? this.guild.language.get('LOG_ARGS_REASON', reason)
				: null,
			duration
				? this.guild.language.get('LOG_ARGS_DURATION', duration)
				: null,
			message && (message.cleanContent || message.attachments.size)
				? this.guild.language.get('LOG_ARGS_MESSAGE', message.cleanContent, message.attachments.map(attachment => `<${attachment.url}>`))
				: null,
			oldMessage && newMessage
				? this.guild.language.get('LOG_ARGS_MESSAGES',
					oldMessage.cleanContent, oldMessage.attachments.map(attachment => `<${attachment.url}>`),
					newMessage.cleanContent, newMessage.attachments.map(attachment => `<${attachment.url}>`))
				: null
		].filter(item => item).join('\n');

		const embed = new MessageEmbed()
			.setTitle(this.guild.language.get(`LOG_ACTION_${action.toUpperCase()}`))
			.setDescription(content)
			.setColor(color);

		if (moderator) { embed.setFooter(this.guild.language.get('LOG_ARGS_MODERATOR', moderator.tag || moderator.user.tag, moderator.id)); }

		this.webhooks[type].send({
			embeds: [embed],
			username: type,
			avatarURL: log[action].icon
		});
	}

	async dm({ user: rawUser, users, action, moderator, reason, duration, guild, msg }) {
		if (!users) users = [rawUser];
		if (typeof moderator === 'string') moderator = await this.guild.client.users.fetch(moderator).catch(() => null);
		for (let user of users) {
			if (typeof user === 'string') user = await this.guild.client.users.fetch(user).catch(() => null);
			if (!user) continue;

			user.send(`${msg.language.get(`LOG_DM_${action.toUpperCase()}`)} ${action.includes('ban') || action === 'kick'
				? 'from'
				: 'on'
				} ${guild.name} ${duration
					? `for ${duration} `
					: ''
				}by ${moderator.tag}: \`${reason}\``).catch(() => null);
		}
	}

	async updateHook(types = ['moderation', 'messages', 'members']) {
		if (!Array.isArray(types)) types = [types];
		let succeeded = 0;
		for (const type of types) {
			const _channel = this.guild.settings.get(`logs.${type}.channel`);
			const webhook = this.guild.settings.get(`logs.${type}.webhook`);
			if (_channel && webhook) {
				const channel = this.guild.channels.get(_channel);
				if (channel) {
					const hook = await channel
						.fetchWebhooks()
						.then(hooks => hooks.get(webhook));
					if (hook) {
						this.webhooks[type] = hook;
						succeeded++;
					}
				} else {
					this.guild.settings.reset(`logs.${type}.channel`);
					this.guild.settings.reset(`logs.${type}.webhook`);
				}
			}
		}
		return succeeded === types.length;
	}

}

module.exports = GuildLogger;
