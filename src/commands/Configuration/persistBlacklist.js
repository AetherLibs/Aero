const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			aliases: ['pbl'],
			description: language => language.get('COMMAND_PERSISTBLACKLIST_DESCRIPTION'),
			usage: '<add|remove> <role:rolename>',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_GUILD;
	}

	async run(msg, [action, role]) {
		const added = action === 'add';
		await msg.guild.settings.sync();

		const currentBlacklistArr = await msg.guild.settings.get('persistBlacklist');
		const currentBlacklist = new Set(currentBlacklistArr);

		if (added)
			currentBlacklist.add(role.id);
		else
			currentBlacklist.delete(role.id);
		

		await msg.guild.settings.update('persistBlacklist', [...currentBlacklist], { arrayAction: 'overwrite' });


		return msg.responder.success(`COMMAND_PERSISTBLACKLIST_${action.toUpperCase()}`, role.name);
	}

};
