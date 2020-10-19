const { Argument } = require('klasa');

module.exports = class extends Argument {

	run(arg, possible, message) {
		// if (regex.test(arg)) return regex.exec(arg)[0];
		// throw message.language.get('RESOLVER_INVALID_EMOJI', possible.name);

		let url;

		try {
			url = new URL(arg);
		} catch {
			throw message.language.get('RESOLVER_INVALID_URL', possible.name);
		}

		if (!['https:', 'http:'].includes(url.protocol)) throw message.language.get('RESOLVER_URL_BADPROTO', possible.name);

		if (url.username?.length || url.password?.length) throw message.language.get('RESOLVER_URL_NOAUTH', possible.name);

		return url.href;
	}

};
