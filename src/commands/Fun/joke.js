const { Command } = require('klasa');
const req = require('@aero/centra');
const { bold } = require('discord-md-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_JOKE_DESCRIPTION')
		});

	}

	async run(msg) {
		const { json } = await req('https://official-joke-api.appspot.com/random_joke').send();
		return msg.sendMessage(bold`📢  joke: \n  *${joke.setup}* \n \n ${joke.punchline}`);
	}

};
