const { Finalizer } = require('klasa');

const { Message } = require('discord.js');

module.exports = class extends Finalizer {

	constructor(...args) {
		super(...args, {
			name: 'deleteFlag',
			enabled: true
		});
	}

	async run(msg, _, res) {
		let { delete: timeout } = msg.flagArgs;
		if (!timeout) return;
		timeout = parseInt(timeout)
		if (!isNaN(timeout) && timeout < 20 && timeout > 0) timeout *= 1000;
		else timeout = 3000;

		await msg.delete({ timeout }).catch(() => null);
		if (res instanceof Message) res.delete().catch(() => null);

		return res;
	}

};