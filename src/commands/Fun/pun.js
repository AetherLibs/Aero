/*
 * Co-Authored-By: Stitch07 (https://github.com/Stitch07)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to [Stitch07](https://github.com/Stitch07) and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Command } = require('@aero/klasa');
const req = require('@aero/centra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['dadjoke'],
			description: language => language.get('COMMAND_PUN_DESCRIPTION')
		});
	}

	async run(msg) {
		const res = await req('https://icanhazdadjoke.com')
			.header('Accept', 'application/json')
			.json()
			.catch(() => { throw msg.language.get('COMMAND_PUN_APIDOWN'); });
		return msg.sendMessage(msg.language.get('COMMAND_PUN_REPLY', res.joke));
	}

};
