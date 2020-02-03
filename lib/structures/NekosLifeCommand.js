const { Command } = require('klasa');
const req = require('@aero/centra');
const { NekoAPI } = require('../util/constants').url;
const { MessageEmbed } = require('discord.js');

class NekosLifeCommand extends Command {

	constructor(name, ...args) {
		super(...args, {
			description: language => language.get(`COMMAND_${name.toUpperCase()}_DESCRIPTION`),
			usage: '<user:username>',
			requiredPermissions: ['EMBED_LINKS'],
			promptLimit: 1
		});

		this.name = name;
	}

	async run(msg, [user]) {
		const result = await req(NekoAPI)
			.path(this.name)
			.json();

		return msg.sendEmbed(new MessageEmbed()
			.setDescription(user === msg.author
				? msg.language.get(`COMMAND_${this.name.toUpperCase()}_SELF`, user)
				: msg.language.get(`COMMAND_${this.name.toUpperCase()}_SOMEONE`, msg.author, user))
			.setImage(result.url)
		);
	}

}

module.exports = NekosLifeCommand;
