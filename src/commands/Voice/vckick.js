const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vck'],
			description: language => language.get('COMMAND_VOICEKICK_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'MOVE_MEMBERS', 'MANAGE_CHANNELS'],
			usage: '<user:membername>'
		});
	}
	async run(msg, [user]) {
		if (!msg.member.hasPermission('MOVE_MEMBERS')) return msg.responder.error('COMMAND_VOICEKICK_NOPERMS');
		if (!user.voice.channelID) return msg.responder.error('COMMAND_VOICEKICK_NOVOICE');
		user.voice.setChannel(null);
		return msg.responder.success();
	}

};
