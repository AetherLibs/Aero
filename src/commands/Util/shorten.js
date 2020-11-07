const { Command } = require('@aero/klasa');

const req = require('@aero/centra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sl'],
			bucket: 1,
			cooldown: 5,
			description: language => language.get('COMMAND_SHORTEN_DESCRIPTION'),
			usage: '<url:url> [slug:string]',
			usageDelim: ' '
		});
	}

	async run(msg, [longUrl, slug]) {
		const body = {
			longUrl,
			findIfExists: true,
			domain: new URL(this.client.config.shortURL).hostname
		};
		if (slug) body.customSlug = slug;
		const { statusCode, json } = await req(this.client.config.shortURL)
			.path('/rest/v2/short-urls')
			.method('POST')
			.header('Accept', 'application/json')
			.header('X-Api-Key', process.env.SHLINK_TOKEN)
			.body(body, 'json')
			.send();

		if (statusCode !== 200) {
			return msg.responder.error('ERROR_SHORT', json.detail);
		} else {
			return msg.responder.success('COMMAND_SHORTEN_SUCCESS', json.longUrl, json.shortUrl);
		}
	}

};
