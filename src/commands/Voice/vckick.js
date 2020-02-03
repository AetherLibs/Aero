const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vck'],
			description: language => language.get('COMMAND_VOICEKICK_NOPERMS'),
			requiredPermissions: ['EMBED_LINKS', 'MOVE_MEMBERS', 'MANAGE_CHANNELS'],
			usage: '<user:username>'
		});
	}
	async run(msg, [user]) {
		if (!msg.member.hasPermission('MOVE_MEMBERS')) { return msg.responder.error(msg.language.get('COMMAND_VOICEKICK_NOPERMS')); }
		if (!user.voiceChannel) { msg.responder.error(msg.language.get('COMMAND_VOICEKICK_NOVOICE')); }
		user.setVoiceChannel(null);
		const embed = new MessageEmbed()
			.setDescription(msg.language.get('COMMAND_VOICEKICK_VOICEKICKED'))
			.setFooter(msg.language.get('COMMAND_VOICEKICK_MODERATOR', msg.author.tag), msg.author.avatarURL());
		return msg.channel.send(embed).catch(() => null);
	}

};
