const { Command } = require('klasa');
const req = require('@aero/centra');

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
		const cfPing = parseInt(await req(this.client.config.pingURL).text());
		const roundTrip = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);

		const discordLatency = roundTrip - wsPing > 0 ? roundTrip - wsPing - cfPing : roundTrip - cfPing;
		const wsLatency = wsPing - cfPing;
		const netLatency = cfPing;

		const totalLatency = discordLatency + wsLatency + netLatency;
		
		return message.sendLocale('COMMAND_PINGPONG', [
			totalLatency,
			discordLatency,
			wsLatency,
			netLatency
		]);
	}

};
