const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vcm'],
			description: language => language.get('COMMAND_VOICEMUTE_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'MUTE_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.hasPermission('MUTE_MEMBERS')) return msg.responder.error(msg.language.get('COMMAND_VOICEMUTE_NOPERMS'));
		if (!user.voiceChannel) msg.responder.error(msg.language.get('COMMAND_VOICEMUTE_NOVOICE'));
		if (user.serverMute) return msg.responder.error(msg.language.get('COMMAND_VOICEMUTE_ALREADY_MUTED'));
		user.setMute(true, reason || msg.language.get('COMMAND_VOICEMUTE_NOREASON'));
		const embed = new MessageEmbed()
			.setDescription(msg.language.get('COMMAND_VOICEMUTE_MUTED'))
			.setFooter(msg.language.get('COMMAND_VOICEMUTE_MODERATOR', msg.author.tag), msg.author.displayAvatarURL());
		return msg.channel.send(embed).catch(() => null);
	}

}