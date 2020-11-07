const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['choose', 'decide'],

			description: language => language.get('COMMAND_CHOICE_DESCRIPTION'),
			usage: '<choices:str> [...]',
			usageDelim: ','
		});

		this
			.customizeResponse('choices', msg => msg.language.get('COMMAND_CHOICE_PROMPT'));
	}

	async run(msg, [...choices]) {
		return msg.send(choices.length === 1
			? msg.language.get('COMMAND_CHOICE_ONEOPTION')
			: msg.language.get('COMMAND_CHOICE_REPLY', choices));
	}

};
