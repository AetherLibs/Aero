const { Command } = require('@aero/klasa');
const req = require('@aero/centra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sentinel'],
			description: language => language.get('COMMAND_LOGIN_DESCRIPTION')
		});
	}

	async run(msg) {
		const { found } = await req(this.client.config.sentinelApiURL)
			.header('Authorization', process.env.SENTINEL_TOKEN)
			.path('/admin/user')
			.query({ id: msg.author.id })
			.json();

		if (found) return msg.responder.success('COMMAND_LOGIN_ALREADY');

		return msg.send(msg.language.get('COMMAND_LOGIN_PROMPT', this.client.config.sentinelURL, msg.guild.settings.get('prefix')));
	}

};
