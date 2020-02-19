const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vcd', 'deafen'],
			description: language => language.get('COMMAND_VOICEDEAFEN_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'DEAFEN_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.hasPermission('DEAFEN_MEMBERS')) return msg.responder.error('COMMAND_VOICEDEAFEN_NOPERMS');
		if (!user.voiceChannel) msg.responder.error('COMMAND_VOICEDEAFEN_NOVOICE');
		if (user.serverDeaf) return msg.responder.error('COMMAND_VOICEDEAFEN_ALREADY_DEAFENED');
		user.setDeaf(true, reason || msg.language.get('COMMAND_VOICEDEAFEN_NOREASON'));
		const embed = new MessageEmbed()
			.setDescription(msg.language.get('COMMAND_VOICEDEAFEN_DEAFENED'))
			.setFooter(msg.language.get('COMMAND_VOICEDEAFEN_MODERATOR', msg.author.tag), msg.author.displayAvatarURL());
		return msg.channel.send(embed).catch(() => null);
	}

}