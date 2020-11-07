const { Command } = require('@aero/klasa');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_MESSAGES', 'BAN_MEMBERS', 'MANAGE_ROLES'],
			aliases: ['antiraid'],
			description: language => language.get('COMMAND_RAID_DESCRIPTION'),
			usage: '[channel:textChannel|disable]'
		});

		this.defaultPermissions = FLAGS.ADMINISTRATOR;
	}

	async run(msg, [channel]) {
		if (!channel) return msg.send(msg.language.get('COMMAND_RAID_HOWTO', this.client.user.username, msg.guild.settings.get('prefix')));
		if (channel === 'disable') {
			await msg.guild.settings.reset('raid.channel');
			return msg.responder.success('COMMAND_RAID_DISABLE');
		}
		await msg.guild.settings.sync();
		await msg.guild.settings.update('raid.channel', channel);
		return msg.responder.success('COMMAND_RAID_SUCCESS', channel);
	}

};
