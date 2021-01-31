const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			aliases: ['ap'],
			description: language => language.get('COMMAND_AUTOPUBLISH_DESCRIPTION'),
			usage: '<channel:newsChannel>'
		});

		this.defaultPermissions = FLAGS.MANAGE_GUILD;
	}

	async run(msg, [channel]) {
		const possibles = msg.guild.settings.get('autopublish');
		if (!possibles.includes(channel.id)) {
			await msg.guild.settings.update('autopublish', channel.id, { arrayAction: 'add' });
			return msg.responder.success('COMMAND_AUTOPUBLISH_ADDED', channel.toString());
		} else {
			await msg.guild.settings.update('autopublish', channel.id, { arrayAction: 'remove' });
			return msg.responder.success('COMMAND_AUTOPUBLISH_REMOVED', channel.toString());
		}
	}

};
