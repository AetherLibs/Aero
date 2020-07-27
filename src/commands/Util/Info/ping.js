const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: language => language.get('COMMAND_PING_DESCRIPTION')
		});
	}

	async run(message) {
		const msg = await message.sendLocale('COMMAND_PING');
		const wsPing = Math.round(this.client.ws.ping);
		const roundTrip = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);
		return message.sendLocale('COMMAND_PINGPONG', [
			roundTrip - wsPing > 0 ? roundTrip - wsPing : roundTrip,
			wsPing
		]);
	}

};
