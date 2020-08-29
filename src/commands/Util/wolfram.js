const { Command } = require('klasa');
const req = require('@aero/centra');
const BASE_URL = 'http://api.wolframalpha.com/v1';

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_WOLFRAM_DESCRIPTION'),
			usage: '<searchTerm:str>',
			cooldown: 5,
			aliases: ['wa']
		});
	}


	async run(msg, [query]) {
		const { statusCode, text } = await req(BASE_URL)
			.path('result')
			.query('appid', process.env.WOLFRAM_TOKEN)
			.query('i', query)
			.send();

		if (statusCode !== 200) return msg.responder.error('COMMAND_WOLFRAM_ERROR');

		return msg.send(text);
	}

};
