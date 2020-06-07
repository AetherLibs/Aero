const { Argument } = require('klasa');

const { emoji: regex } = require('../../lib/util/constants').regexes;

module.exports = class extends Argument {

	run(arg, possible, message) {
		if (regex.test(arg)) return regex.exec(arg)[0];
		throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);
	}

};
