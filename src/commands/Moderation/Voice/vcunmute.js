/*
 * Co-Authored-By: Harsh Peshwani
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to Harsh Peshwani and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Command } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['vcum', 'letsay', 'letspeak'],
			description: language => language.get('COMMAND_VOICEUNMUTE_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS', 'MUTE_MEMBERS'],
			usage: '<user:membername> [reason:...string]',
			usageDelim: ' '
		});
	}
	async run(msg, [user, reason]) {
		if (!msg.member.permissions.has('MUTE_MEMBERS')) return msg.responder.error('COMMAND_VOICEUNMUTE_NOPERMS');
		if (!user.voice.channelID) return msg.responder.error('COMMAND_VOICEUNMUTE_NOVOICE');
		if (!user.voice.serverMute) return msg.responder.error('COMMAND_VOICEMUTE_ALREADY_UNMUTED');
		user.voice.setMute(false, reason || msg.language.get('COMMAND_VOICEUNMUTE_NOREASON'));
		return msg.responder.success();
	}

};
