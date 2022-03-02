const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['mr'],
			description: language => language.get('COMMAND_MUTEROLE_DESCRIPTION'),
			usage: '[rolename:rolename|roleid:role]'
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async run(msg, [role]) {
		if (!role) return this.display(msg);
		await msg.guild.settings.sync();
		await msg.guild.settings.update('mod.roles.mute', role.id);
		return msg.responder.success('COMMAND_MUTEROLE_SET', role.name);
	}

	display(msg) {
		const role = msg.guild.roles.cache.get(msg.guild.settings.get('mod.roles.mute'));
		if (!role) return msg.responder.error('COMMAND_MUTEROLE_NONE');
		return msg.responder.success('COMMAND_MUTEROLE_DISPLAY', role.name);
	}

};
