const { Monitor } = require('@aero/klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreEdits: false,
			ignoreOthers: false
		});

		this.giftRegex = /(https?:\/\/)?(www\.)?(discord\.gift|discord(app)?\.com\/gifts)\/(\s)?.+/ui;
	}

	async run(msg) {
		if (!msg.guild || !msg.guild.settings.get('mod.anti.gifts') || msg.exempt) return;
		if (this.giftRegex.test(msg.content)) msg.delete();
	}

};
