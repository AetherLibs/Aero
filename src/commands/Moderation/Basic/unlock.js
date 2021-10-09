const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS }, VoiceChannel } = require('discord.js');

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
		let override = {
			SEND_MESSAGES: null,
			ADD_REACTIONS: null
		};

		if (channel instanceof VoiceChannel) {
			override = {
				CONNECT: null
			}
		}

		await channel.updateOverwrite(
			msg.guild.id,
			override,
			msg.guild.language.get('COMMAND_UNLOCK_REASON')
		);
		

		return msg.responder.unlock();
	}


};
