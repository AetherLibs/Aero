const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_CHANNELS'],
			aliases: ['ul'],
			description: language => language.get('COMMAND_UNLOCK_DESCRIPTION'),
			usage: '[channel:channel]'
		});

		this.defaultPermissions = FLAGS.MANAGE_CHANNELS;
	}

	async run(msg, [channel = msg.channel]) {
		await channel.updateOverwrite(
			msg.guild.id,
			{
				SEND_MESSAGES: null,
				ADD_REACTIONS: null
			},
			msg.guild.language.get('COMMAND_UNLOCK_REASON')
		);

		return msg.responder.unlock();
	}


};
