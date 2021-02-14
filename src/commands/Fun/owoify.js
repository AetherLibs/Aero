const { Command } = require('@aero/klasa');
const { owoify } = require('~/lib/util/util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_OWOIFY_DESCRIPTION'),
			aliases: ['owo'],
			usage: '<text:string>'
		});
	}

	async run(msg, [text]) {
		return msg.send(owoify(text.slice(0, 2000)));
	}

};
