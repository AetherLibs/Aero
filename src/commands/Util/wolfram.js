const { Command } = require('@aero/klasa');
const { MessageAttachment } = require('discord.js');
const req = require('@aero/http');
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
		if ([/\bip\b/i, /location/i, /geoip/i, /where am i/i]
			.some(reg => reg.test(query))) return msg.responder.error('COMMAND_WOLFRAM_ERROR');

		if (msg.flagArgs.graphical) return this.graphical(msg, query);

		const res = await req(BASE_URL)
			.path('result')
			.query('appid', process.env.WOLFRAM_TOKEN)
			.query('i', query)
			.send();

		const text = await res.body.text();

		if (res.statusCode !== 200) return msg.responder.error('COMMAND_WOLFRAM_ERROR');
		if (text.length <= 2000) return msg.send(text);
		else return msg.responder.error('COMMAND_WOLFRAM_LENGTH', `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query).replace(/\s+/, '+')}`);
	}

	async graphical(msg, query) {
		const { statusCode, body } = await req(BASE_URL)
			.path('simple')
			.query('appid', process.env.WOLFRAM_TOKEN)
			.query('units', 'metric')
			.query('width', '1200')
			.query('background', '36393E')
			.query('foreground', 'white')
			.query('i', query)
			.send();

		if (statusCode !== 200) return msg.responder.error('COMMAND_WOLFRAM_ERROR');

		const attachment = new MessageAttachment(body, 'wolfram.gif');

		return msg.send(attachment);
	}

};
