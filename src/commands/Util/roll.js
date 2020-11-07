const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_ROLL_DESCRIPTION'),
			usage: '[how_many_dice:integer{1,100}] [how_many_sides:integer{1,100}]',
			usageDelim: ' '
		});
	}

	run(msg, [amount = 1, sides = 6]) {
		if (amount > 10) return this.aboveTen(msg, amount, sides);
		return this.belowTen(msg, amount, sides);
	}

	aboveTen(msg, amount, sides) {
		const generated = {};
		for (let i = 0; i < amount; i++) {
			const num = Math.floor(Math.random() * sides + 1);
			generated[num]
				? generated[num]++
				: generated[num] = 1;
		}

		const out = Object.entries(generated)
			.sort((a, b) => a[0] - b[0])
			.map(([num, amt]) => `**${num}**: ${amt} times`)
			.join('\n');


		return msg.send(`Rolled:\n${out}`);
	}

	belowTen(msg, amount, sides) {
		const generated = [];
		for (let i = 0; i < amount; i++) generated.push(Math.floor(Math.random() * sides + 1));

		return msg.send(`Rolled: ${generated.join(', ')}`);
	}

};
