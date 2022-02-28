const { Command } = require('@aero/klasa');
const req = require('@aero/http');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['hb', 'haste'],
			description: language => language.get('COMMAND_HASTEBIN_DESCRIPTION'),
			usage: '<code:str>'
		});
	}

	async run(msg, [code]) {
		const { key } = await req(this.client.config.hasteURL)
			.post()
			.path('documents')
			.body(code)
			.json();
		return msg.send(`${this.client.config.hasteURL}/${key}`);
	}

};
