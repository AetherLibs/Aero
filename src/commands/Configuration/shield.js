const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			description: language => language.get('COMMAND_SHIELD_DESCRIPTION'),
			usage: '[enable|disable]'
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [state]) {
		let newState;
		switch(state) {
			case 'enable':
				newState = true;
				break;
			case 'disable':
				newState = false;
				break;
			default:
				newState = !msg.guild.settings.get('mod.shield');
		}

		await msg.guild.settings.update('mod.shield', newState);

		return msg.sendLocale(`COMMAND_SHIELD_${newState ? 'ENABLED' : 'DISABLED'}`);
	}

};
