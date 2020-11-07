const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS }, User, Role } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_MESSAGES'],
			aliases: ['ignore'],
			description: language => language.get('COMMAND_EXEMPT_DESCRIPTION'),
			usage: '<user:user|role:role|channel:textChannel>'
		});

		this.defaultPermissions = FLAGS.ADMINISTRATOR;
	}

	async run(msg, [target]) {
		const type = target instanceof User
			? 'users'
			: target instanceof Role
				? 'roles'
				: 'channels';
		await msg.guild.settings.sync();
		await msg.guild.settings.update(`mod.ignored.${type}`, target, { arrayAction: 'add' });
		return msg.responder.success();
	}

};
