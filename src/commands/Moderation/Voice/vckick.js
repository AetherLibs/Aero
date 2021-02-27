/*
 * Co-Authored-By: Harsh Peshwani
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Credit example: Credit goes to Harsh Peshwani and [ravy](https://ravy.pink). (c) [The Aero Team](https://aero.bot) 2021
 */
const { Command } = require('@aero/klasa');

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
		if (!msg.member.permissions.has('MOVE_MEMBERS')) return msg.responder.error('COMMAND_VOICEKICK_NOPERMS');
		if (!user.voice.channelID) return msg.responder.error('COMMAND_VOICEKICK_NOVOICE');
		user.voice.setChannel(null);
		return msg.responder.success();
	}

};
