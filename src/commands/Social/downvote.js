const { Command } = require('klasa');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_DOWNVOTE_DESCRIPTION'),
			usage: '<user:username>',
			aliases: ['down', 'dv']
		});
	}

	async run(msg, [user]) {
		const res = await this.client.drep.vote('down', msg.author.id, user.id);

		return res.success
			? msg.responder.success('COMMAND_DOWNVOTE_SUCCESS', user.username)
			: msg.responder.error('COMMAND_DOWNVOTE_ERROR', user.username, res.message);

	}

};
