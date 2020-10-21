const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: true,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!this.client.chatwatch?.ws || this.client.chatwatch?.ws?.socket?.readyState === 0) return;
		if (!msg.guild || !msg.content) return;
		this.client.chatwatch.ingest(msg.content, {
			user: msg.author.id,
			channel: msg.channel.id,
			guild: msg.guild.id,
			message: msg.id
		});
	}


};
