const { Monitor } = require('@aero/klasa');
const req = require('@aero/centra');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: false,
			ignoreSelf: false,
			ignoreEdits: false,
			ignoreOthers: false
		});

		this.codeRegex = /^```(?<lang>\w+)?\n(?<code>.+?)(?:\n)?```$/s;
	}


	async run(msg) {
		if (!msg.guild) return false;

		const state = msg.guild.settings.get('autocarbon');

		if (!state) return false;

		if (this.codeRegex.test(msg.content)) {
			const { code } = this.codeRegex.exec(msg.content).groups;

			const img = await req(this.client.config.carbonURL)
				.method('POST')
				.path('/api/cook')
				.body({
					code,
					language: 'auto',
					theme: 'one-dark',
					backgroundColor: 'rgb(54, 57, 63)',
					fontFamily: 'JetBrains Mono',
					paddingHorizontal: '20px',
					paddingVertical: '20px',
					windowControls: false,
					dropShadowBlurRadius: '10px',
					dropShadowOffsetY: '0px'
				}, 'json')
				.raw();
			if (!img.toString().startsWith('An error occurred')) {
				await msg.delete();
				return msg.channel.sendFile(img, 'code.png');
			} else
				return msg.responder.error();
		} else
			return false;
	}

};
