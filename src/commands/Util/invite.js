const { MessageEmbed, Permissions: { FLAGS } } = require('discord.js');
const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_INVITE_DESCRIPTION'),
			aliases: ['inv']
		});
	}

	async run(message) {
		return !message.guild.me.permissions.has(FLAGS.EMBED_LINKS)
			? message.sendLocale('COMMAND_INVITE')
			: message.sendEmbed(new MessageEmbed()
				.setAuthor(this.client.user.username, this.client.user.avatarURL())
				.setDescription(`${message.guild.language.get('COMMAND_INVITE_SUCCESS', this.client.user.username, this.client.config.inviteURL || this.client.invite, this.client.config.supportServer)}`)
			);
	}

};
