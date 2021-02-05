/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */
const { Task } = require('@aero/klasa');

module.exports = class extends Task {

	async run({ channel, user, text }) {
		const _channel = this.client.channels.cache.get(channel);
		if (!_channel) return false;
		return _channel.send(`<@${user}> You wanted me to remind you: ${text}`);
	}

};
