const { MessageEmbed, Permissions: { FLAGS } } = require('discord.js');
const { Command } = require('@aero/klasa');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_INVITE_DESCRIPTION'),
			aliases: ['inv']
		});
	}

	async run(message) {
		const invite
			= req('https://discord.com/oauth2/authorize')
				.query('client_id', this.client.user.id)
				.query('scope', this.client.config.install_params.scopes.join(' '))
				.query('permissions', this.client.config.install_params.permissions)
				.url.href
			|| this.client.config.inviteURL
			|| this.client.invite;

		return !message.guild.me.permissions.has(FLAGS.EMBED_LINKS)
			? message.sendLocale('COMMAND_INVITE', this.client.user.username, invite)
			: message.sendEmbed(new MessageEmbed()
				.setAuthor(this.client.user.username, this.client.user.avatarURL())
				.setDescription(`${message.guild.language.get('COMMAND_INVITE_SUCCESS', this.client.user.username, invite, this.client.config.supportServer)}`)
			);
	}

};
