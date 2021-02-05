/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Argument } = require('@aero/klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['int'] });
	}

	run(arg, possible, message) {
		const { min, max } = possible;
		const number = parseInt(arg);
		if (!Number.isInteger(number)) throw message.language.get('RESOLVER_INVALID_INT', possible.name);
		return this.constructor.minOrMax(this.client, number, min, max, possible, message) ? number : null;
	}

};
