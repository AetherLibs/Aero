const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	run(message, command, args) {
		if (!this.client.commandCounter) return;

		this.client.commandCounter.inc({ name: command.name, guildId: message?.guild?.id ?? 'dms', userId: message.author.id });
	}

};
