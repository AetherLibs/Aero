const { Command } = require('klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['br'],
			description: language => language.get('COMMAND_BOTROLE_DESCRIPTION'),
			usage: '[rolename:rolename|roleid:role|disable]'
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [role]) {
		if (!role) return this.display(msg);
		if (role === 'disable') {
			await msg.guild.settings.reset('mod.roles.bots');
			return msg.responder.success('COMMAND_BOTROLE_DISABLE', role.name);
		} else {
			await msg.guild.settings.sync();
			await msg.guild.settings.update('mod.roles.bots', role.id);
			return msg.responder.success('COMMAND_BOTROLE_SET', role.name);
		}
	}

	display(msg) {
		const role = msg.guild.settings.get(msg.guild.settings.get('mod.roles.bots'));
		if (!role) return msg.responder.error('COMMAND_BOTROLE_NONE');
		return msg.responder.success('COMMAND_BOTROLE_DISPLAY', role.name);
	}

};
