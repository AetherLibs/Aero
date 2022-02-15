const { Command } = require('@aero/klasa');
const { MessageEmbed } = require('discord.js');
const { poll, color } = require('../../../lib/util/constants');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_POLL_DESCRIPTION'),
			usage: '<options:string>',
			aliases: ['poll'],
			requiredPermissions: ['EMBED_LINKS']
		});
		this.numbers = poll;
	}

	async run(msg, [options]) {
		const opt = options.split(/,\s*/);
		if (opt.length > 10)
			return msg.responder.error('COMMAND_POLL_TOO_MANY_OPTIONS');

		if (opt.length < 2)
			return msg.responder.error('COMMAND_POLL_TOO_FEW_OPTIONS');

		const embed = new MessageEmbed()
			.setColor(color.INFORMATION)
			.setFooter(msg.language.get('COMMAND_POLL_EMBED_FOOTER'));
		embed.setDescription(opt.map((option, idx) => `${idx + 1}. ${option}`).join('\n'));

		return msg.channel.sendEmbed(embed).then(async message => {
			for (let i = 0; i < opt.length; i++)
				await message.react(this.numbers[i + 1]); /* eslint-disable-line no-await-in-loop */
		});
	}

};
