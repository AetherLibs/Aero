const { Command, Duration } = require('@aero/klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_REMIND_DESCRIPTION'),
			usage: '<when:time> <text:...string>',
			usageDelim: ' ',
			aliases: ['remind', 'reminder']
		});
	}

	async run(msg, [time, text]) {
		await this.client.schedule.create('reminder', time, {
			data: {
				channel: msg.channel.id,
				user: msg.author.id,
				text
			}
		});
		return msg.responder.success('COMMAND_REMIND_REPLY', Duration.toNow(time));
	}

};
