const Command = require('../../../lib/structures/ModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_NICKNAMES'],
			description: language => language.get('COMMAND_DECANCER_DESCRIPTION'),
			usage: '<member:member>'
		});

		this.defaultPermissions = FLAGS.MANAGE_NICKNAMES;
	}

	async run(msg, [member]) {
		if (!this.comparePermissions(msg.member, member)) return msg.responder.error('COMMAND_DECANCER_NOPERMS');
		member.cleanName();
		return msg.responder.success();
	}


};
