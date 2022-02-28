const { Command } = require('@aero/klasa');
const { AllHtmlEntities } = require('html-entities');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			bucket: 2,
			cooldown: 4,
			description: language => language.get('COMMAND_CHUCKNORRIS_DESCRIPTION')
		});
	}

	async run(msg) {
		const res = await req('https://api.icndb.com/jokes/random').json();
		return msg.sendMessage(`📢 Chuck Norris joke: **${new AllHtmlEntities().decode(res.value.joke)}**`);
	}

};
