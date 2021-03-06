const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_AVATAR_DESCRIPTION'),
			usage: '[user:username]',
			aliases: ['av']
		});
	}

	async run(msg, [user = msg.author]) {
		if (msg.flagArgs.proxy && msg.originalAuthor && user.id === msg.author.id) user = msg.originalAuthor;

		const embed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL())
			.setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
			.setDescription([
				[
					`[png](${user.displayAvatarURL({ size: 2048, format: 'png' })})`,
					`[jpg](${user.displayAvatarURL({ size: 2048, format: 'jpg' })})`,
					`[webp](${user.displayAvatarURL({ size: 2048, format: 'webp' })})`
				].join(' | '),
				[
					`[16](${user.displayAvatarURL({ size: 16, dynamic: true })})`,
					`[32](${user.displayAvatarURL({ size: 32, dynamic: true })})`,
					`[64](${user.displayAvatarURL({ size: 64, dynamic: true })})`,
					`[128](${user.displayAvatarURL({ size: 128, dynamic: true })})`,
					`[256](${user.displayAvatarURL({ size: 256, dynamic: true })})`,
					`[512](${user.displayAvatarURL({ size: 512, dynamic: true })})`,
					`[1024](${user.displayAvatarURL({ size: 1024, dynamic: true })})`,
					`[2048](${user.displayAvatarURL({ size: 2048, dynamic: true })})`
				].join(' | ')
			].join('\n'));

		const member = await msg?.guild.members.fetch(user.id).catch(() => null);
		if (member && member.customAvatar) embed.setFooter(msg.language.get('COMMAND_AVATAR_GUILD_AVAILABLE_FOOTER', msg.guild.settings.get('prefix')));

		return msg.send({ embed });
	}

};
