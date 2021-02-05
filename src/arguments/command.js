/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Argument } = require('@aero/klasa');

module.exports = class extends Argument {

	constructor(...args) {
		super(...args, { aliases: ['cmd'] });
	}

	async run(arg, possible, message) {
		const command = this.client.commands.get(arg.toLowerCase());
		if (command && await message.hasAtLeastPermissionLevel(command.permissionLevel)) return command;
		throw message.language.get('RESOLVER_INVALID_PIECE', possible.name, 'command');
	}

};
