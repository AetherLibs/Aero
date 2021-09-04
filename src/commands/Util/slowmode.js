const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_SLOWMODE_DESCRIPTION'),
			usage: '<delay:duration|off>',
			aliases: ['slow'],
			runIn: ['text'],
			requiredPermissions: ['MANAGE_CHANNELS']
		});

		this.defaultPermissions = FLAGS.MANAGE_CHANNELS;
	}

	async run(msg, [duration]) {
		const offset = duration === 'off' ? 0 : (duration.getTime() - new Date().getTime()) / 1000;

		if (offset > (60 * 60 * 6)) throw 'COMMAND_SLOWMODE_ERROR_HIGH';
		if (offset < 0) throw 'COMMAND_SLOWMODE_ERROR_LOW';

		await msg.channel.setRateLimitPerUser(offset);

		return msg.responder.success();
	}

};
