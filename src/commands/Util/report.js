const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REPORT_DESCRIPTION'),
			usage: '[user:user] [reason:string] [proof:string]',
			usageDelim: ' ',
			quotedStringSupport: true
		});

		this.channels = new Set();

		this.deprecated = 'The platform this goes to is no longer active. Please report users using /report in Aero\'s Community: <https://aero.bot/community>';
	}
};
