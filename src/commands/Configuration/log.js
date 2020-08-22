const { Command } = require('klasa');
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
		return channel === 'disable'
			? this.disableLogs(msg, type)
			: this.setLogs(msg, type, channel);
	}

	async displayLogs(msg, type) {
		if (type) {
			const _channel = msg.guild.settings.get(`logs.${type}.channel`);
			if (!_channel || !msg.guild.channels.has(_channel)) return msg.responder.error('COMMAND_LOG_DISPLAY_NOCHANNEL', type);
			return msg.send(msg.language.get('COMMAND_LOG_DISPLAY_ONE', type, msg.guild.channels.get(_channel)));
		} else {
			const out = [];
			for (const _type of ['moderation', 'messages', 'members']) {
				const _channel = msg.guild.settings.get(`logs.${_type}.channel`);
				_channel && msg.guild.channels.has(_channel)
					? out.push(msg.language.get('COMMAND_LOG_DISPLAY_ONE', _type, msg.guild.channels.get(_channel)))
					: out.push(msg.language.get('COMMAND_LOG_DISPLAY_NOCHANNEL', _type));
			}

			return msg.send(out.join('\n'));
		}
	}

	async setLogs(msg, type, channel) {
		// create hook
		const hook = await channel.createWebhook(`${this.client.user.username} Log: ${type}`,
			{ avatar: this.client.user.displayAvatarURL(), reason: msg.language.get('COMMAND_LOG_REASON') });

		// set db entries
		await msg.guild.settings.update(`logs.${type}.channel`, channel);
		await msg.guild.settings.update(`logs.${type}.webhook`, hook.id);

		// populate logger cache
		msg.guild.log.webhooks[type] = hook;

		return msg.responder.success('COMMAND_LOG_SUCCESS', type, channel);
	}

	async disableLogs(msg, type) {
		const channelID = msg.guild.settings.get(`logs.${type}.channel`);
		const webhookID = msg.guild.settings.get(`logs.${type}.webhook`);

		// reset db
		await msg.guild.settings.reset(`logs.${type}.channel`);
		await msg.guild.settings.reset(`logs.${type}.webhook`);

		// delete webhook
		if (msg.guild.channels.has(channelID)) {
			const hooks = await msg.guild.channels.get(channelID).fetchWebhooks();
			if (hooks.has(webhookID)) hooks.get(webhookID).delete().catch(() => null);
		}

		// clean hook cache
		msg.guild.log.webhooks[type] = null;

		return msg.responder.success();
	}


};
