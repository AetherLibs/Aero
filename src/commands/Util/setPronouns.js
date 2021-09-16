const { Command } = require('@aero/klasa');
const { pronounMapping, pronounDB } = require('~/lib/util/constants');
const req = require('@aero/centra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pn', 'pronouns'],
			description: language => language.get('COMMAND_PRONOUNS_DESCRIPTION'),
			usage: '<pronouns:str>'
		});
	}

	async run(msg, [pronouns]) {
		pronouns = pronouns.toLowerCase();

		if (pronounMapping[pronouns]) pronouns = pronounMapping[pronouns];
		else if (!pronounDB[pronouns]) throw 'COMMAND_PRONOUNS_UNKNOWN';

		await req('https://ravy.org/api/v1/')
			.method('POST')
			.path('/users')
			.path(msg.author.id)
			.path('pronouns')
			.body({
				pronouns
			})
			.header('Authorization', process.env.RAVY_TOKEN)
			.send();

		return msg.responder.success('COMMAND_PRONOUNS_SUCCESS', pronounDB[pronouns]);
	}

};
