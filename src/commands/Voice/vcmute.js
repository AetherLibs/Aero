const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vcm'],
			description: language => language.get('COMMAND_VOICEMUTE_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'MUTE_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.hasPermission('MUTE_MEMBERS')) return msg.responder.error('COMMAND_VOICEMUTE_NOPERMS');
		if (!user.voice.channelID) return msg.responder.error('COMMAND_VOICEMUTE_NOVOICE');
		if (user.voice.serverMute) return msg.responder.error('COMMAND_VOICEMUTE_ALREADY_MUTED');
		user.voice.setMute(true, reason || msg.language.get('COMMAND_VOICEMUTE_NOREASON'));
		return msg.responder.success();
	}

};
