const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_XKCD_DESCRIPTION'),
			usage: '[id:integer]'
		});
	}

	async run(msg, [id]) {
		const comic = id
			? await this.client.xkcd.id(id)
			: await this.client.xkcd.random();

		const embed = new MessageEmbed()
			.setTitle(`[${comic.id}] ${comic.title}`)
			.setURL(comic.url)
			.setImage(comic.image)
			.setFooter(comic.text);

		return msg.sendEmbed(embed);
	}

};
