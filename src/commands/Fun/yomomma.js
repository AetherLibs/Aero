const { Command } = require('@aero/klasa');
const req = require('@aero/centra');
const { bold } = require('discord-md-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['yomama'],
			description: language => language.get('COMMAND_YOMAMMA_DESCRIPTION')
		});
		this.deprecated = 'recurring SSL issues with the API.';
	}

	async run(msg) {
		const res = await req('https://api.yomomma.info').json();
		return msg.sendMessage(bold`📢 Yomomma joke: *${res.joke}*`);
	}

};
