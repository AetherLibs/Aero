const { Event } = require('klasa');

module.exports = class extends Event {

	run(message, command, params, error) {

		if (error.message) message.sendCode('JSON', error.message).catch(err => this.client.emit('wtf', err));
		if (error instanceof Error) {
			this.client.emit('wtf', `[COMMAND] ${command.path}\n${error.stack || error}`);
			this.client.sentry.captureException(error);
		}
		else message.responder.error('ERROR_GENERIC', error).catch(err => this.client.emit('wtf', err));
	}

};
