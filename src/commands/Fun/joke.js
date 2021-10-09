const { Command } = require('@aero/klasa');
const req = require('@aero/centra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_JOKE_DESCRIPTION')
		});
	}

	async run(msg) {
		const joke = await req('https://jokes.zakariaa.nl/random_joke').json();
		return msg.sendMessage(`${joke.setup}\n\n*${joke.punchline}*`);
	}

};
