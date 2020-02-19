const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_WEBHOOKS'],
			aliases: ['ul'],
			description: language => language.get('COMMAND_LOG_DESCRIPTION'),
			usage: '[moderation|messages|members] [channel:channel]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_WEBHOOKS;
	}

	async run(msg, [type, channel]) {
		if (!channel) return this.displayLogs(msg, type);
		await msg.guild.settings.sync();
		await msg.guild.settings.update(`logs.${type}.channel`, channel);
		const hook = await channel.createWebhook(`${this.client.user.username} Log: ${type}`,
			{ avatar: this.client.user.displayAvatarURL(), reason: msg.language.get('COMMAND_LOG_REASON') });
		await msg.guild.settings.update(`logs.${type}.webhook`, hook.id);
		return msg.responder.success('COMMAND_LOG_SUCCESS', type, channel);
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


};
