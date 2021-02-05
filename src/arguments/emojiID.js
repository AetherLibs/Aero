/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Argument } = require('@aero/klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		const emoji = this.constructor.regex.emoji.test(arg) && this.constructor.regex.emoji.exec(arg)[1];
		if (emoji) return emoji;
		throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);
	}

};
