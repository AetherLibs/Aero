const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');

class KSoftImageCommand extends Command {

	constructor({ name, nsfw, reddit }, ...args) {
		super(...args, {
			description: language => language.get(`COMMAND_${name.toUpperCase()}_DESCRIPTION`),
			requiredPermissions: ['ATTACH_FILES'],
			nsfw: nsfw || name === 'nsfw',
			cooldown: 2
		});

		this.reddit = reddit;
	}

	async run(msg) {
		let image;
		if (['meme', 'wikihow', 'nsfw', 'aww'].includes(this.name)) image = await this.client.ksoft.images[this.name](); else {
			image = this.reddit
				? await this.client.ksoft.images.reddit(this.name, { removeNSFW: !this.nsfw })
				: await this.client.ksoft.images.random(this.name, { nsfw: this.nsfw });
		}

		let attribution = msg.language.get('COMMAND_KSOFT_POWEREDBY');
		if (image.post) attribution += ` | by ${image.post.author} (${image.post.subreddit})`;
		const embed = new MessageEmbed()
			.setImage(image.url)
			.setFooter(attribution);
		if (image.post) embed.setTitle(image.post.title).setURL(image.post.link);
		return msg.channel.sendEmbed(embed);
	}

}

module.exports = KSoftImageCommand;
