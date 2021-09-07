const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_CHANNELS'],
			aliases: ['lemon'],
			description: language => language.get('COMMAND_LEMONBOARD_DESCRIPTION'),
			usage: '[channel:textChannel] [lemons:integer]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_CHANNELS;
	}

	async run(msg, [channel, lemons]) {
		if (!channel && !lemons) return msg.sendLocale('COMMAND_LEMONBOARD_EXPLAINER');
		if (channel) await this.setChannel(channel, msg.guild);
		if (!msg.guild.settings.get('lemonboard.channel') && lemons) throw 'COMMAND_LEMONBOARD_NOCHANNEL';
		if (lemons) this.setLemons(lemons, msg.guild);

		return msg.responder.success();
	}

	setChannel(channel, guild) {
		return guild.settings.update('lemonboard.channel', channel);
	}

	setLemons(lemons, guild) {
		guild.settings.update('lemonboard.trigger', lemons);
	}

};
