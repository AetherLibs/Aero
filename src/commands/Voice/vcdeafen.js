const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vcd', 'deafen'],
			description: language => language.get('COMMAND_VOICEDEAFEN_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'DEAFEN_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.hasPermission('DEAFEN_MEMBERS')) return msg.responder.error('COMMAND_VOICEDEAFEN_NOPERMS');
		if (!user.voice.channelID) return msg.responder.error('COMMAND_VOICEDEAFEN_NOVOICE');
		if (user.voice.serverDeaf) return msg.responder.error('COMMAND_VOICEDEAFEN_ALREADY_DEAFENED');
		user.voice.setDeaf(true, reason || msg.language.get('COMMAND_VOICEDEAFEN_NOREASON'));
		return msg.responder.success();
	}

};
