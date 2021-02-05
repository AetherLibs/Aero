const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	run(message, command, params, error) {
		// if (command.name === 'eval') return;
		if (error.message) message.sendCode('JSON', error.message).catch(err => this.client.emit('wtf', err));
		if (error instanceof Error) {
			this.client.emit('wtf', `[COMMAND] ${command.path}\n${error.stack || error}`);
			this.client?.sentry?.setTag('command', command.name);
			this.client?.sentry?.setTag('params', JSON.stringify(params) ?? 'none');
			this.client?.sentry?.setTag('guild', message?.guild?.id ?? 'none');
			this.client?.sentry?.setTag('channel', message?.channel?.id ?? 'none');
			this.client?.sentry?.setTag('user', message?.author?.id ?? 'none');
			this.client?.sentry?.captureException(error);
		} else {
			if (typeof error === 'string' && message.language.language[error]) error = message.language.get(error);
			message.responder.error('ERROR_SHORT', error).catch(err => this.client.emit('wtf', err));
		}
	}

};
