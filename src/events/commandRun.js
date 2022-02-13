const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	run(message, command, args) {
		if (this.client.aggregator.metricsEnabled)
			this.client.aggregator.registerCommand(command.name, message?.guild?.id ?? 'dms', message.author.id);
	}

};
