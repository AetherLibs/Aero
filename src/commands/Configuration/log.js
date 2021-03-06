const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_WEBHOOKS'],
			description: language => language.get('COMMAND_LOG_DESCRIPTION'),
			usage: '[moderation|messages|members] [channel:channel|disable]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_WEBHOOKS;
	}

	async run(msg, [type, channel]) {
		if (!channel) return this.displayLogs(msg, type);
		await msg.guild.settings.sync();
		const types = type ? [type] : ['moderation', 'messages', 'members'];
		return channel === 'disable'
			? this.disableLogs(msg, types)
			: this.setLogs(msg, types, channel);
	}

	async displayLogs(msg, type) {
		if (type) {
			const _channel = msg.guild.settings.get(`logs.${type}.channel`);
			if (!_channel || !msg.guild.channels.cache.has(_channel)) return msg.responder.error('COMMAND_LOG_DISPLAY_NOCHANNEL', type);
			return msg.send(msg.language.get('COMMAND_LOG_DISPLAY_ONE', type, msg.guild.channels.cache.get(_channel)));
		} else {
			const out = [];
			for (const _type of ['moderation', 'messages', 'members']) {
				const _channel = msg.guild.settings.get(`logs.${_type}.channel`);
				_channel && msg.guild.channels.cache.has(_channel)
					? out.push(msg.language.get('COMMAND_LOG_DISPLAY_ONE', _type, msg.guild.channels.cache.get(_channel)))
					: out.push(msg.language.get('COMMAND_LOG_DISPLAY_NOCHANNEL', _type));
			}

			return msg.send(out.join('\n'));
		}
	}

	async setLogs(msg, types, channel) {
		const currentHooks = await channel.fetchWebhooks();

		const succeeded = [];

		const promises = [];

		for (const type of types) {
			// skip existing
			const _channel = msg.guild.settings.get(`logs.${type}.channel`);
			const _webhook = msg.guild.settings.get(`logs.${type}.webhook`);
			if ((_channel === channel.id) && _webhook) {
				const hook = currentHooks.get(_webhook);
				if (hook)
					continue;
			}

			// create hooks
			promises.push(channel.createWebhook(`${this.client.user.username} Log: ${type}`,
				{ avatar: this.client.user.displayAvatarURL(), reason: msg.language.get('COMMAND_LOG_REASON') })
				.then(async hook => {
				// set db entries
					succeeded.push(type);
					await msg.guild.settings.update(`logs.${type}.channel`, channel);
					await msg.guild.settings.update(`logs.${type}.webhook`, hook.id);

					// populate logger cache
					msg.guild.log.webhooks[type] = hook; /* eslint-disable-line require-atomic-updates */
				})
				.catch(() => { throw 'COMMAND_LOG_NOWEBHOOKPERMS'; }));
		}

		await Promise.all(promises);

		if (succeeded.length)
			msg.responder.success('COMMAND_LOG_SUCCESS', succeeded.join(', '), channel);
		else
			msg.responder.success();
	}

	async disableLogs(msg, types) {
		for (const type of types) {
			const channelID = msg.guild.settings.get(`logs.${type}.channel`);
			const webhookID = msg.guild.settings.get(`logs.${type}.webhook`);

			// reset db
			msg.guild.settings.reset(`logs.${type}.channel`);
			msg.guild.settings.reset(`logs.${type}.webhook`);

			// delete webhook
			if (msg.guild.channels.cache.has(channelID)) {
				msg.guild.channels.cache.get(channelID).fetchWebhooks()
					.then(hooks => {
						if (hooks.has(webhookID)) hooks.get(webhookID).delete().catch(() => null);
					});
			}

			// clean hook cache
			msg.guild.log.webhooks[type] = null; /* eslint-disable-line require-atomic-updates */
		}

		return msg.responder.success();
	}


};
