/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Argument } = require('@aero/klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		// if (regex.test(arg)) return regex.exec(arg)[0];
		// throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);

		let url;

		try {
			url = new URL(arg);
		} catch {
			try {
				url = new URL(arg.replace(/<(.*?)>/, '$1'));
			} catch {
				throw message.language.get('RESOLVER_INVALID_URL', possible.name);
			}
		}

		if (!['https:', 'http:'].includes(url.protocol)) throw message.language.get('RESOLVER_URL_BADPROTO', possible.name);

		if (url.username?.length || url.password?.length) throw message.language.get('RESOLVER_URL_NOAUTH', possible.name);

		return url.href;
	}

};
