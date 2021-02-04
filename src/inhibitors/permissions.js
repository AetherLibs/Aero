/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */ 
const { Inhibitor } = require('@aero/klasa');

module.exports = class extends Inhibitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			spamProtection: true
		});
	}

	async run(message, command) {
		// secure admin commands, all others don't need permissionLevels
		if (command.permissionLevel >= 9 && !this.client.options.owners.includes(message.author.id)) throw true;
		// overwrite for bot owners
		if (this.client.options.owners.includes(message.author.id)) return;
		// permission nodes don't work in DMs. the runIn inhibitor will deal with them.
		if (!message.guild) return;
		const check = await this.client.permissions.canUse(message, command);
		if (!check) {
			await message.responder.error('INHIBITOR_PERM_NODES', `${command.category.toLowerCase()}.${command.name}`);
			throw true;
		}
	}

};
