const { Monitor } = require('@aero/klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: false,
			ignoreBots: false,
			ignoreSelf: true,
			ignoreEdits: true,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild) return;
		for (const obj of [msg.author, msg.member, msg.guild].filter(i => !!i)) {
			const cur = obj.settings.get('stats.messages');
			await obj.settings.sync();
			obj.settings.update('stats.messages', cur + 1);
		}
	}


};
