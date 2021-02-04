/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */ 
const { Argument } = require('@aero/klasa');

const { emoji: regex } = require('../../lib/util/constants').regexes;

module.exports = class extends Argument {

	run(arg, possible, message) {
		if (regex.test(arg)) return regex.exec(arg)[0];
		throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);
	}

};
