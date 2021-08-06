const { Event } = require('@aero/klasa');

module.exports = class extends Event {

	run(event, args, error) {
		if (error instanceof Error) {
			this.client.emit('wtf', `[EVENT] ${event.path}\n${error.stack || error}`);
			this.client?.sentry?.setTag('event', event.name);
			this.client?.sentry?.setTag('args', JSON.stringify(args) ?? 'none');
			this.client?.sentry?.captureException(error);
		}
	}

};
