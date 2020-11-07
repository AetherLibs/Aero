const { Command } = require('@aero/klasa');

module.exports = class extends Command {


	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_UPVOTE_DESCRIPTION'),
			usage: '<user:username>',
			aliases: ['up', 'uv']
		});
	}

	async run(msg, [user]) {
		const res = await this.client.drep.vote('up', msg.author.id, user.id);

		return res.success
			? msg.responder.success('COMMAND_UPVOTE_SUCCESS', user.username)
			: msg.responder.error('COMMAND_UPVOTE_ERROR', user.username, res.message);
	}

};
