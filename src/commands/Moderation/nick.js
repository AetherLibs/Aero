const Command = require('../../../lib/structures/ModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_NICKNAMES'],
			description: language => language.get('COMMAND_NICK_DESCRIPTION'),
			usage: '<member:member> [name:string{1,50}]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.MANAGE_NICKNAMES;
	}

	async run(msg, [member, name]) {
		if (!this.comparePermissions(msg.member, member)) return msg.responder.error('COMMAND_NICK_NOPERMS');
		return member.setNickname(name || null)
			.then(() => msg.responder.success())
			.catch((err) => msg.responder.error('COMMAND_NICK_ERROR', err));
	}


};
