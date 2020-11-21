const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			aliases: ['ar'],
			description: language => language.get('COMMAND_AUTOROLE_DESCRIPTION'),
			usage: '<add|remove|list:default> [roleid:role|all|rolename:rolename]',
			usageDelim: ' ',
			subcommands: true
		});

		this.defaultPermissions = FLAGS.MANAGE_ROLES;
	}

	async add(msg, [role]) {
		if (!role) return this.noRole(msg, 'ADD');
		if (role === 'all') return msg.responder.error('COMMAND_AUTOROLE_NOADDALL');

		const autoRoles = msg.guild.settings.get('mod.roles.auto');
		if (autoRoles.includes(role.id)) return this.noRole(msg, 'EXISTS');

		await msg.guild.settings.sync();
		await msg.guild.settings.update('mod.roles.auto', role.id, { arrayAction: 'add' });
		return msg.responder.success('COMMAND_AUTOROLE_ADD', role.name);
	}

	async remove(msg, [role]) {
		if (!role) return this.noRole(msg, 'REMOVE');
		if (role === 'all') {
			await msg.guild.settings.reset('mod.roles.auto');
			return msg.responder.success('COMMAND_AUTOROLE_DISABLE');
		} else {
			const autoRoles = msg.guild.settings.get('mod.roles.auto');
			if (!autoRoles.includes(role.id)) return this.noRole(msg, 'WRONG');
			await msg.guild.settings.sync();
			await msg.guild.settings.update('mod.roles.auto', role.id, { arrayAction: 'remove' });
			return msg.responder.success('COMMAND_AUTOROLE_REMOVE', role.name);
		}
	}

	async list(msg) {
		const autoRoles = msg.guild.settings.get('mod.roles.auto');
		if (!autoRoles.length) return msg.responder.error('COMMAND_AUTOROLE_NOLIST');
		const names = autoRoles.map(id => `- ${msg.guild.roles.cache.has(id) && msg.guild.roles.cache.get(id).name}` || id).join('\n');
		return msg.responder.success('COMMAND_AUTOROLE_LIST', names);
	}

	noRole(msg, type) {
		return msg.responder.error(`COMMAND_AUTOROLE_NOROLE_${type}`);
	}

};
