const { Task } = require('@aero/klasa');

module.exports = class extends Task {

	async run({ channel, user, text }) {
		const _channel = this.client.channels.cache.get(channel);
		if (!_channel) return false;
		return _channel.send(`<@${user}> You wanted me to remind you: ${text}`);
	}

};
