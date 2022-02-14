const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_AVATAR_DESCRIPTION'),
			usage: '[user:membername]',
			aliases: ['gav']
		});
	}

	async run(msg, [member = msg.member]) {
		const embed = new MessageEmbed()
			.setAuthor(member.user.tag, member.displayAvatarURL())
			.setImage(member.displayAvatarURL({ size: 2048, dynamic: true }))
			.setDescription([
				[
					`[png](${member.displayAvatarURL({ size: 2048, format: 'png' })})`,
					`[jpg](${member.displayAvatarURL({ size: 2048, format: 'jpg' })})`,
					`[webp](${member.displayAvatarURL({ size: 2048, format: 'webp' })})`
				].join(' | '),
				[
					`[16](${member.displayAvatarURL({ size: 16, dynamic: true })})`,
					`[32](${member.displayAvatarURL({ size: 32, dynamic: true })})`,
					`[64](${member.displayAvatarURL({ size: 64, dynamic: true })})`,
					`[128](${member.displayAvatarURL({ size: 128, dynamic: true })})`,
					`[256](${member.displayAvatarURL({ size: 256, dynamic: true })})`,
					`[512](${member.displayAvatarURL({ size: 512, dynamic: true })})`,
					`[1024](${member.displayAvatarURL({ size: 1024, dynamic: true })})`,
					`[2048](${member.displayAvatarURL({ size: 2048, dynamic: true })})`
				].join(' | ')
			].join('\n'))
			.setFooter(
				member.customAvatar ? 
				msg.language.get('COMMAND_AVATAR_GUILD_FOOTER', msg.guild.settings.get('prefix')) : 
				msg.language.get("COMMAND_AVATAR_GUILD_WARNING")
			);

		return msg.send({ embed });
	}

};
