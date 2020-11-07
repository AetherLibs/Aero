const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REVERSEAVATAR_DESCRIPTION'),
			usage: '[user:username]',
			aliases: ['revav', 'rav']
		});
	}

	async run(msg, [user = msg.author]) {
		const embed = new MessageEmbed()
			.setDescription(`[Search ${user.username}'s Avatar](https://images.google.com/searchbyimage?image_url=${encodeURIComponent(user.displayAvatarURL({ format: 'png', size: 2048 }))})`);

		return msg.send({ embed });
	}

};
