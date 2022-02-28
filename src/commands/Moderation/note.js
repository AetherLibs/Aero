const Command = require('../../../lib/structures/MultiModerationCommand');
const { Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			requiredPermissions: ['BAN_MEMBERS'],
			aliases: ['n'],
			description: language => language.get('COMMAND_NOTE_DESCRIPTION'),
			usage: '<user  or  users:members> [note:...string]',
			usageDelim: ' '
		});

		this.defaultPermissions = FLAGS.BAN_MEMBERS;
	}

	async run(msg, [members, reason = msg.language.get('COMMAND_NOTE_NOREASON')]) {
		const moderatable = await this.getModeratable(msg.member, members, true);
		if (!moderatable.length) return msg.responder.error('COMMAND_NOTE_NOPERMS', members.length > 1);

		await Promise.all(moderatable.map(member => member.settings.sync()));

		for (const member of moderatable)
			member.settings.update('notes', { reason, moderator: msg.member.id }, { arrayAction: 'add' });

		return msg.responder.success();
	}


};
