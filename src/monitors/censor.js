const { Monitor } = require('@aero/klasa');
const sanitize = require('@aero/sanitizer');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.censor').length || msg.exempt) return;

		const content = sanitize(msg.content).toLowerCase().trim();

		const contains = msg.guild.settings.get('mod.censor').reduce((acc, cur) => acc || content.includes(cur), false);
		if (contains) msg.delete();
	}

};
