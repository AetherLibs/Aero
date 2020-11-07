const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_CHANNELS'],
			aliases: ['l'],
			description: language => language.get('COMMAND_LOCK_DESCRIPTION'),
			usage: '[channel:channel]'
		});

		this.defaultPermissions = FLAGS.MANAGE_CHANNELS;
	}

	async run(msg, [channel = msg.channel]) {
		await channel.updateOverwrite(
			msg.guild.id,
			{
				SEND_MESSAGES: false,
				ADD_REACTIONS: false
			},
			msg.guild.language.get('COMMAND_LOCK_REASON')
		);

		return msg.responder.lock();
	}


};
