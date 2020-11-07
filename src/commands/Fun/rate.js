const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_RATE_DESCRIPTION'),
			usage: '[user:user]'
		});
	}

	async run(msg, [user = msg.author]) {
		const percentage = Math.round(Math.random() * 100);
		return msg.send(msg.language.get('COMMAND_RATE_REPLY', user, percentage));
	}

};
