const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			aliases: ['cns'],
			description: language => language.get('COMMAND_CARBON_DESCRIPTION')
		});

		this.defaultPermissions = FLAGS.MANAGE_GUILD;
	}

	async run(msg) {
		const state = msg.guild.settings.get('autocarbon');
		if (state) {
			await msg.guild.settings.update('autocarbon', false);
			return msg.responder.success('COMMAND_CARBON_DISABLED');
		} else {
			await msg.guild.settings.update('autocarbon', true);
			return msg.responder.success('COMMAND_CARBON_ENABLED');
		}
	}

};
