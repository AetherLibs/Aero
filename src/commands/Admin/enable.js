/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */ 
const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			guarded: true,
			description: language => language.get('COMMAND_ENABLE_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	async run(message, [piece]) {
		piece.enable();
		return message.sendCode('diff', message.language.get('COMMAND_ENABLE', piece.type, piece.name));
	}

};
