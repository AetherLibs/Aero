/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Stitch07](https://github.com/Stitch07) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Command } = require('@aero/klasa');
const req = require('@aero/centra');
const { bold } = require('discord-md-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['yomama'],
			description: language => language.get('COMMAND_YOMAMMA_DESCRIPTION')
		});
		// this.deprecated = 'recurring SSL issues with the API.';
	}

	async run(msg) {
		const res = await req('https://api.yomomma.info').json();
		return msg.sendMessage(bold`📢 Yomomma joke: *${res.joke}*`);
	}

};
