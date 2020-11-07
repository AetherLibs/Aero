const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vcud', 'undeafen'],
			description: language => language.get('COMMAND_VOICEUNDEAFEN_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'DEAFEN_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.hasPermission('DEAFEN_MEMBERS')) return msg.responder.error('COMMAND_VOICEUNDEAFEN_NOPERMS');
		if (!user.voice.channelID) return msg.responder.error('COMMAND_VOICEUNDEAFEN_NOVOICE');
		if (!user.voice.serverDeaf) return msg.responder.error('COMMAND_VOICEDEAFEN_ALREADY_UNDEAFENED');
		user.voice.setDeaf(false, reason || msg.language.get('COMMAND_VOICEUNDEAFEN_NOREASON'));
		return msg.responder.success();
	}

};
