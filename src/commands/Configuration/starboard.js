const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_CHANNELS'],
			aliases: ['star'],
			description: language => language.get('COMMAND_STARBOARD_DESCRIPTION'),
			usage: '[channel:textChannel] [stars:integer]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_CHANNELS;
	}

	async run(msg, [channel, stars]) {
		if (!channel && !stars) return msg.sendLocale('COMMAND_STARBOARD_EXPLAINER');
		if (channel) await this.setChannel(channel, msg.guild);
		if (!msg.guild.settings.get('starboard.channel') && stars) throw 'COMMAND_STARBOARD_NOCHANNEL';
		if (stars) this.setStars(stars, msg.guild);

		return msg.responder.success();
	}

	setChannel(channel, guild) {
		return guild.settings.update('starboard.channel', channel);
	}

	setStars(stars, guild) {
		guild.settings.update('starboard.trigger', stars);
	}

};
