const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			description: language => language.get('COMMAND_PERSIST_DESCRIPTION'),
			usage: '<enable|disable>'
		});

		this.defaultPermissions = FLAGS.MANAGE_GUILD;
	}

	async run(msg, [input]) {
		const enabled = input === 'enable';
		await msg.guild.settings.sync();
		await msg.guild.settings.update('persist', enabled);
		return msg.responder.success(`COMMAND_PERSIST_${input.toUpperCase()}`);
	}

};
