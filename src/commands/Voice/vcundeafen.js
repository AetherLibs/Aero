const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vcud', 'undeafen'],
			description: language => language.get('COMMAND_VOICEUNDEAFEN_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'DEAFEN_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.hasPermission('DEAFEN_MEMBERS')) return msg.responder.error('COMMAND_VOICEUNDEAFEN_NOPERMS');
		if (!user.voiceChannel) msg.responder.error('COMMAND_VOICEUNDEAFEN_NOVOICE');
		if (!user.serverDeaf) return msg.responder.error('COMMAND_VOICEDEAFEN_ALREADY_UNDEAFENED');
		user.setDeaf(false, reason || msg.language.get('COMMAND_VOICEUNDEAFEN_NOREASON'));
		const embed = new MessageEmbed()
			.setDescription(msg.language.get('COMMAND_VOICEUNDEAFEN_UNDEAFENED'))
			.setFooter(msg.language.get('COMMAND_VOICEUNDEAFEN_MODERATOR', msg.author.tag), msg.author.displayAvatarURL());
		return msg.channel.send(embed).catch(() => null);
	}

}