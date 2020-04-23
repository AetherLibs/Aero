const { Command } = require('klasa');
const req = require('@aero/centra');
const url = 'https://www.conversationstarters.com/random.php';

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_TOPIC_DESCRIPTION')
		});
	}

	async run(msg) {
		const text = await req(url)
			.text()
			.then(this.process);

		return msg.send(text);		
	}

	process(text) {
		return text.slice(39);
	}

};
