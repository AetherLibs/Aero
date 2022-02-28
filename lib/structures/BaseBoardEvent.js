const { Event } = require('@aero/klasa');

const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}

	buildEmbed(msg, guild, channel, message, reacts) {
		const embed = new MessageEmbed()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png' }))
			.setColor(msg.member.displayColor || guild.me.displayColor || 'RANDOM')
			.setDescription([
				msg.content.slice(0, 1500) + (msg.content.length > 1500 ? '...' : ''),
				msg.embeds && msg.embeds.length
					? `\n${msg.embeds[0].title
						? `**${msg.embeds[0].title}**${msg.embeds[0].description ? ' - ' : ''}`
						: ''
					}${msg.embeds[0].description
						? msg.embeds[0].description
						: ''
					}\n`
					: '',
				`${reacts} | [jump to message](https://discord.com/channels/${guild.id}/${channel}/${message})`
			].join('\n'));

		if (msg.embeds?.[0]?.image?.url) embed.setImage(msg.embeds[0].image.url);
		if (msg.embeds?.[0]?.type === 'image') embed.setImage(msg.embeds[0].url);
		if (msg.embeds?.[0]?.type === 'article' && msg.embeds[0].thumbnail?.url) embed.setImage(msg.embeds[0].thumbnail.url);
		if (msg.attachments?.size) {
			const [images, files] = msg.attachments.partition(attachment => attachment.height);
			if (images.size) embed.setImage(images.first().url);
			if (files.size) embed.attachFiles(files.array());
		}
		return embed;
	}

};
