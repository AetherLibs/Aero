const { Command } = require('@aero/klasa');
const { default: owoify } = require('owoify-js');


module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_OWOIFY_DESCRIPTION'),
			aliases: ['owo'],
			usage: '<text:string>'
		});
	}

	async run(msg, [text]) {
		const content = owoify(text.slice(0, 2000), msg.flagArgs.uwu || msg.flagArgs.uvu)
			.replace(/`/g, '\\`')
			.replace(/\*/g, '\\*');
		return msg.send(content);
	}

};
