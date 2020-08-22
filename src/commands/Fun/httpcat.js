const { Command } = require('klasa');
const { MessageAttachment } = require('discord.js');
const req = require('@aero/centra');
const BASE_URL = 'https://http.cat';

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_HTTPCAT_DESCRIPTION'),
			aliases: ['hcat', 'http'],
			usage: '<code:integer{100,600}>'
		});
	}

	async run(msg, [code]) {
		const res = await req(BASE_URL)
			.path(code.toString())
			.send();

		if (res.statusCode !== 200) throw 'COMMAND_HTTPCAT_INVALID';

		const img = new MessageAttachment(res.body, 'cat.jpg');

		return msg.send(img);
	}

};
