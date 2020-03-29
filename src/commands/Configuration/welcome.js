const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			aliases: ['wc'],
			description: language => language.get('COMMAND_WELCOME_DESCRIPTION'),
			usage: '[channel:channelname|disable] [text:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_GUILD;
	}

	async run(msg, [channel, text]) {
		if (!channel) return this.show(msg);
		if (channel === 'disable') return this.disableWelcome(msg);
		if (channel && text) return this.enableWelcome(msg, channel, text);
		return msg.responder.error('COMMAND_WELCOME_NOTEXT');
	}

	show(msg) {
		const channelID = msg.guild.settings.get('welcome.channel');
		if (!channelID) return msg.responder.error('COMMAND_WELCOME_SHOW_NONE');
		const channel = msg.guild.channels.get(channelID);
		if (!channel) return msg.responder.error('COMMAND_WELCOME_SHOW_NONE');

		const text = msg.guild.settings.get('welcome.message');
		if (!text) return msg.responder.error('COMMAND_WELCOME_SHOW_NONE');

		return msg.responder.success('COMMAND_WELCOME_SHOW', channel.toString(), text);
	}

	disableWelcome(msg) {
		msg.guild.settings.reset('welcome.channel');
		msg.guild.settings.reset('welcome.message');
		return msg.responder.success('COMMAND_WELCOME_DISABLED');
	}

	enableWelcome(msg, channel, text) {
		msg.guild.settings.update('welcome.channel', channel);
		msg.guild.settings.update('welcome.message', text);
		return msg.responder.success('COMMAND_WELCOME_ENABLED', channel.toString(), text);
	}

};
