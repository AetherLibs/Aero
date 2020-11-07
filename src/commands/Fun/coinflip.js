const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['coin'],
			description: language => language.get('COMMAND_COINFLIP_DESCRIPTION'),
			usage: '[coins:int{1,1000}]'
		});
	}

	run(msg, [coins = 0]) {
		if (coins > 1) {
			let heads = 0;
			let tails = 0;
			for (let i = 0; i < coins; i++) {
				if (Math.random() > 0.5) heads++;
				else tails++;
			}
			return msg.send(msg.language.get('COMMAND_COINFLIP_REPLY_MULTIPLE', coins, heads, tails));
		}
		const heads = Math.random() > 0.5;
		return msg.send(msg.language.get('COMMAND_COINFLIP_REPLY_SINGLE', heads));
	}

};
